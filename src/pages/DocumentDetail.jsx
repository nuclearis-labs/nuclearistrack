// documents.js
import React, { useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router';
import Footer from '../components/Footer';
import { Title, Scroll, CopyButton, Label } from '../styles/components';
import { Table, Row, Col2, Col4 } from '../styles/tableComponents';
import GoogleMap from '../components/GoogleMap';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';
import { useDropzone } from 'react-dropzone';
import { hashFile } from '../utils/hashFile';

const fade = keyframes`
  from {
    box-shadow: none;
  }

  to {
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);

  }
`;

const DropZone = styled.div`
  height: 40vh;
  width: 400px;
  padding: 0 22px;
  background-color: ${(props) =>
    props.valid === true
      ? 'MEDIUMSPRINGGREEN'
      : props.valid === false
      ? 'lightcoral'
      : 'none'}
  float: right;
  margin-right: 20px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid grey;
  width: fit-content;
  min-width: 400px;
  &:hover {
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
    animation: ${fade} 100ms linear;
  }
`;
const FlexWrap = styled.div`
  display: flex;
  height: 100%;
`;
const FlexWrapRight = styled(FlexWrap)`
  float: right;
  padding-right: 20px;
  height: auto;
`;

const Left = styled.div`
  padding: 0;
  width: 60%;
  background: #fff;
  min-width: 461px;
  ${Row} {
    padding: 4px 60px;
  }
`;

const Right = styled(Scroll)`
  padding: 30px 40px;
  width: 40%;
  background: #ccc;
  min-width: 307px;
  text-align: left;
  box-sizing: border-box;
`;

const ResumenTit = styled(Title)`
  color: #8c6239;
  font-size: 16px;
  line-height: 16px;
  margin: 10px 0;
`;

const ProcesosTit = styled(ResumenTit)`
  color: #333;
  margin-top: 50px;
`;

const Nota = styled.div`
  color: #333;
  font-size: 13px;
  line-height: 16px;
  margin: 10px 0;
`;

export default function DocumentDetail() {
  const [web3] = useWeb3();
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [valid, setValid] = useState(null);
  const params = useParams();
  const [document, setDocument] = useState(undefined);

  const onDrop = useCallback(
    (acceptedFiles) => onFileChange(acceptedFiles),
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    async function getDocument() {
      let processContract = new web3.eth.Contract(Process.abi, params.process);

      const msgSender = await web3.eth.getCoinbase();
      const document = await processContract.methods
        .getDocument(params.hash)
        .call({ from: msgSender });
      setDocument(document);
    }
    if (web3) getDocument();
  }, [web3]);

  function onFileChange([file]) {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      hashFile(event.target.result).then((hash) => setHash(hash));
    };
    if (file) reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <LoggedHeader />
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <Title>DOCUMENTO </Title>
          </FlexWrapRight>
          <Table>
            {document && (
              <DropZone
                valid={hash === null ? null : hash === document[1]}
                {...getRootProps()}
              >
                <Label>VERIFICAR DOCUMENTO</Label>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <pre style={{ transform: 'translateY(55px)', margin: 0 }}>
                    Suelte el archivo aquí
                  </pre>
                ) : (
                  <pre style={{ transform: 'translateY(45px)', margin: 0 }}>
                    {hash
                      ? `Nombre del archivo: ${
                          file.name
                        }\nHash del archivo: ${hash.substr(
                          0,
                          8
                        )}...${hash.substr(-8)}\n${
                          hash === document[1]
                            ? 'Estado: AUTENTICO'
                            : 'Estado: NO COINCIDE'
                        }`
                      : `Arrastre el archivo hacia aquí,\no haga click para seleccionarlo`}
                  </pre>
                )}
              </DropZone>
            )}
          </Table>
        </Left>
        <Right>
          {document && (
            <>
              <ResumenTit>DETALLES DE DOCUMENTO</ResumenTit>
              <Row>
                <Col4 className="color">NOMBRE</Col4>
                <Col2 className="bold">{document[0]}</Col2>
              </Row>
              <Row>
                <Col4 className="color">HASH</Col4>
                <Col2 className="bold" id="hash">
                  {document[1].substr(0, 10)}...
                  {document[1].substr(-10)}
                </Col2>
              </Row>
              <Row>
                <Col4 className="color">FECHA</Col4>
                <Col2 className="bold">
                  {' '}
                  {new Date(parseInt(document[4] + '000')).toLocaleString()}
                </Col2>
              </Row>
              <ProcesosTit>UBICACIÓN</ProcesosTit>

              <GoogleMap
                coords={{
                  lat: parseFloat(web3.utils.hexToAscii(document[2])),
                  lng: parseFloat(web3.utils.hexToAscii(document[3])),
                }}
              />

              <ProcesosTit>OBSERVACIONES</ProcesosTit>
              <Nota>
                {document[5] == undefined ? 'No hay comentarios' : document[5]}
              </Nota>
            </>
          )}
        </Right>
      </FlexWrap>
      <Footer />
    </>
  );
}
