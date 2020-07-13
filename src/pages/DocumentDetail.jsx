// documents.js
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import Footer from '../components/Footer';
import { Title, Label } from '../styles/components';
import { Row, Col2, Col4 } from '../styles/tableComponents';
import GoogleMap from '../components/GoogleMap';
import Process from '../build/contracts/Process.json';
import { useDropzone } from 'react-dropzone';
import { hashFile } from '../utils/hashFile';
import { UserContext } from '../context/UserContext';
import {
  Nota,
  ProcesosTit,
  ResumenTit,
  Right,
  Left,
  FlexWrapRight,
  FlexWrap,
  DropZone,
} from '../styles/documentDetail';

export default function DocumentDetail() {
  const params = useParams();
  const { web3 } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
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
      console.log(document);

      setDocument(document);
    }
    getDocument();
    // eslint-disable-next-line
  }, [params.hash, params.process]);

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
      <FlexWrap>
        <Left>
          <FlexWrapRight
            style={{ flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <Title>DOCUMENTO </Title>
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
          </FlexWrapRight>
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
                {document[5] === '' ? 'No hay comentarios' : document[5]}
              </Nota>
            </>
          )}
        </Right>
      </FlexWrap>
      <Footer />
    </>
  );
}
