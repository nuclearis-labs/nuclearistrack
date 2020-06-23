// documents.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Footer from '../components/Footer';
import { Title, Scroll, CopyButton } from '../styles/components';
import { Table, Row, Col2, Col4 } from '../styles/tableComponents';
import Clipboard from 'clipboard';
import Spinner from '../components/Spinner';
import { GoogleMap } from '../components/GoogleMap';

const FlexWrap = styled.div`
  display: flex;
  height: 100%;
`;
const FlexWrapRight = styled(FlexWrap)`
  float: right;
  padding-right: 20px;
  height: auto;
`;

const DocImgHolder = styled.iframe`
  float: right;
  margin-right: 20px;
  margin-bottom: 50px;
  width: 90%;
  height: 600px;
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

interface IDetailsDocument {
  name: string;
  documentHash: string;
  longitude: number;
  latitude: number;
  comment: string;
  mineTime: string;
}

export default function DocumentList() {
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(true);
  const { process, hash } = useParams();
  const clipboard = new Clipboard('.btn');

  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [verified, setVerified] = useState<boolean | null>(null);
  const [details, setDetails] = useState<IDetailsDocument | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/doc/getOne?contract=' + process + '&hash=' + hash,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      const date = new Date(data.mineTime * 1000);

      data.mineTime = `${date.getDate()}/${date.getMonth() +
        1}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${(
        '0' + date.getMinutes()
      ).slice(-2)}`;

      setDetails(data);
      setLoading(false);

      fetch(`/api/doc/getOneFile?storageHash=${data.storageHash}`)
        .then(response => {
          if (response.ok) {
            response.blob().then(pdf => {
              let objectURL = URL.createObjectURL(pdf);
              setDocument(objectURL);
              setDocLoading(false);
            });
          }
        })
        .catch(function(error) {
          console.log(
            'Hubo un problema con la petición Fetch:' + error.message
          );
        });
    });
  }, [process, hash]);

  function handleVerification(e: any) {
    e.persist();
    let body = new FormData();
    //@ts-ignore
    body.append('file', e.target.files[0]);
    fetch(`/api/doc/verify?contract=${process}&hash=${hash}`, {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      if (res.status === 200) {
        setVerified(true);
        setTimeout(() => setVerified(null), 5000);
      } else {
        setVerified(false);
        setTimeout(() => setVerified(null), 5000);
      }
    });
  }

  return (
    <>
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <Title>DOCUMENTO </Title>
          </FlexWrapRight>
          <Table>
            {!docLoading && document !== null ? (
              <DocImgHolder src={document} />
            ) : (
              <div className="d-flex justify-content-center">
                <Spinner size="lg" color="primary" />
              </div>
            )}
          </Table>
        </Left>
        <Right>
          {details == null ? (
            <div className="d-flex justify-content-center">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <>
              <ResumenTit>DETALLES DE DOCUMENTO</ResumenTit>
              <Row>
                <Col4 className="color">NOMBRE</Col4>
                <Col2 className="bold">{details.name}</Col2>
              </Row>
              <Row>
                <Col4 className="color">HASH</Col4>
                <Col2 className="bold" id="hash">
                  {details.documentHash.substr(0, 10)}...
                  {details.documentHash.substr(-10)}
                  <CopyButton
                    className="btn"
                    style={{ display: 'inline' }}
                    onClick={() => setCopyButtonText('Copied')}
                    data-clipboard-text={details.documentHash}
                  >
                    {copyButtonText}
                  </CopyButton>
                </Col2>
              </Row>
              <Row>
                <Col4 className="color">TIME</Col4>
                <Col2 className="bold">{details.mineTime}</Col2>
              </Row>
              <Row>
                <Col4 className="color">VERIFICAR</Col4>
                <Col2 className="bold">
                  {verified === true ? (
                    'Documento es autentico'
                  ) : verified === false ? (
                    'Huellas digital NO corresponden'
                  ) : (
                    <input
                      type="file"
                      name="file"
                      onChange={handleVerification}
                    />
                  )}
                </Col2>
              </Row>
              <ProcesosTit>UBICACIÓN</ProcesosTit>
              <GoogleMap
                coords={{
                  longitude: Number(details.longitude),
                  latitude: Number(details.latitude)
                }}
              />

              <ProcesosTit>OBSERVACIONES</ProcesosTit>
              <Nota>
                {details.comment == undefined
                  ? 'No hay comentarios'
                  : details.comment}
              </Nota>
            </>
          )}
        </Right>
      </FlexWrap>
      <Footer />
    </>
  );
}
