// documents.js
import React from 'react';
import styled from 'styled-components';
import Footer from '../components/Footer';
import { Title, Scroll, CopyButton } from '../styles/components';
import { Table, Row, Col2, Col4 } from '../styles/tableComponents';
// import { GoogleMap } from '../components/GoogleMap';

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

export default function DocumentList() {
  return (
    <>
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <Title>DOCUMENTO </Title>
          </FlexWrapRight>
          <Table>{/* {Dropdown Area for files} */}</Table>
        </Left>
        <Right>
          <>
            <ResumenTit>DETALLES DE DOCUMENTO</ResumenTit>
            <Row>
              <Col4 className="color">NOMBRE</Col4>
              <Col2 className="bold">{/* Nomre de archivo */}</Col2>
            </Row>
            <Row>
              <Col4 className="color">HASH</Col4>
              <Col2 className="bold" id="hash">
                {/* details.documentHash.substr(0, 10) */}...
                {/* details.documentHash.substr(-10) */}
                <CopyButton
                  className="btn"
                  style={{ display: 'inline' }}
                  onClick={() => {} /* setCopyButtonText('Copied') */}
                  data-clipboard-text="text"
                ></CopyButton>
              </Col2>
            </Row>
            <Row>
              <Col4 className="color">TIME</Col4>
              <Col2 className="bold">{/* details.mineTime */}</Col2>
            </Row>
            <Row>
              <Col4 className="color">VERIFICAR</Col4>
              <Col2 className="bold">
                {/*    {verified === true ? (
                  'Documento es autentico'
                ) : verified === false ? (
                  'Huellas digital NO corresponden'
                ) : (
                  <input
                    type="file"
                    name="file"
                    onChange={handleVerification}
                  />
                )} */}
              </Col2>
            </Row>
            <ProcesosTit>UBICACIÓN</ProcesosTit>
            {/*  <GoogleMap
              coords={{
                longitude: Number(details.longitude),
                latitude: Number(details.latitude),
              }}
            /> */}

            <ProcesosTit>OBSERVACIONES</ProcesosTit>
            <Nota>
              {/*  {details.comment == undefined
                ? 'No hay comentarios'
                : details.comment} */}
            </Nota>
          </>
        </Right>
      </FlexWrap>
      <Footer />
    </>
  );
}
