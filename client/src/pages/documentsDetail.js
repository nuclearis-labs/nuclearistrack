// documents.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import axios from 'axios';
import Footer from '../components/footer';
import { Title, Scroll } from '../Archive/components/components.js';
import { Table, Row, Col2 } from '../Archive/components/tableComponents.js';
import RSKLink from '../components/RSKLink';

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

function Documents() {
  const { process, hash } = useParams();
  const [document, setDocument] = useState();
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/doc/getOne?contract=' + process + '&hash=' + hash,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setDocument(data);
    });
  }, [process, hash]);

  return (
    <>
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <Title>DOCUMENTO </Title>
          </FlexWrapRight>
          <Table>
            <DocImgHolder
              src={`data:application/pdf;base64,${document &&
                document.fileBuffer}`}
            />
          </Table>
        </Left>
        <Right>
          {document && (
            <>
              <ResumenTit>DETALLES DE DOCUMENTO</ResumenTit>
              <Row>
                <Col2 className="color">NOMBRE</Col2>
                <Col2 className="bold">{document && document.name}</Col2>
              </Row>
              <Row>
                <Col2 className="color">HASH</Col2>
                <Col2 className="bold">
                  <RSKLink hash={document.documentHash} type="tx" testnet />
                </Col2>
              </Row>
              <ProcesosTit>OBSERVACIONES</ProcesosTit>
              <Nota>{document && document.comment}</Nota>
            </>
          )}
        </Right>
      </FlexWrap>
      <Footer />
    </>
  );
}
export default Documents;
