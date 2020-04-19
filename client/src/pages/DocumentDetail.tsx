// documents.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import axios from 'axios';
import Footer from '../components/Footer';
import { Title, Scroll } from '../styles/components';
import { Table, Row, Col2 } from '../styles/tableComponents';

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
  width: 800px;
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
  name:string;
  documentHash:string;
  comment:string;
}

export default function DocumentList() {
  const { process, hash } = useParams();


  const [details, setDetails] = useState<IDetailsDocument | null>(null);
  const [document, setDocument] = useState<string | null>(null);
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/doc/getOne?contract=' + process + '&hash=' + hash,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setDetails(data);

      fetch(`/api/doc/getOne?storageHash=${data.storageHash}`)
        .then(response => {
          if (response.ok) {
            response.blob().then(pdf => {
              let objectURL = URL.createObjectURL(pdf);
              setDocument(objectURL);
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

  return (
    <>
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <Title>DOCUMENTO </Title>
          </FlexWrapRight>
          <Table>{document && <DocImgHolder src={document} />}</Table>
        </Left>
        <Right>
          {details && (
            <>
              <ResumenTit>DETALLES DE DOCUMENTO</ResumenTit>
              <Row>
                <Col2 className="color">NOMBRE</Col2>
                <Col2 className="bold">{details?.name}</Col2>
              </Row>
              <Row>
                <Col2 className="color">HASH</Col2>
                <Col2 className="bold">
                  {details?.documentHash.substr(0, 8)}...
                  {details?.documentHash.substr(-8)}
                </Col2>
              </Row>
              <ProcesosTit>OBSERVACIONES</ProcesosTit>
              <Nota>
                {
                  details?.comment === 'undefined' &&
                  'No hay comentarios'}
              </Nota>
            </>
          )}
        </Right>
      </FlexWrap>
      <Footer />
    </>
  );
}
