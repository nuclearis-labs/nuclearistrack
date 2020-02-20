// projects.js
import React from 'react';
import styled from 'styled-components';
import Modal from '../components/modal.js';
import { Title, Button, Wrap, Scroll} from '../components/components.js';
import { Table, Row, HeadRow, HeadRowMonsterrat, Col, Col2, Col3 } from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';

const FlexWrap = styled.div`display:flex;height:100%;`;
const FlexWrapRight = styled(FlexWrap)`
  float:right;
  padding-right:20px;
  height:auto;
`;
const Left = styled.div`
  padding: 0;
  width:60%;
  background:#fff;
  min-width: 461px;
  ${Row} {padding: 4px 60px;}
`;
const Right = styled(Scroll)`
  padding: 30px 40px;
  width:40%;
  background:#ccc;
  min-width: 307px;
  text-align:left;
  box-sizing:border-box;
`;
const AddProyectBtn = styled.a`
  color:#8c6239;
  font-family: Montserrat, sans-serif;
  font-size:12px;
  font-weight:700;
  text-decoration:none;
  letter-spacing: 1px;
  padding:40px 20px 0 20px;
  cursor:pointer;
  :hover{color:#000;}
  `;

const ResumenTit = styled(Title)`
  color:#8c6239;
  font-size:16px;
  line-height:16px;
  margin:10px 0;
`;

const ProcesosTit = styled(ResumenTit)`
  color:#333;
  margin-top:50px;
`;

const ResumenName = styled.div`
  color:#333;
  font-weight:700;
  font-size:23px;
  letter-spacing:1px;
  margin-bottom:10px;
`;

const ScrollBoxFullHeight = styled(Scroll)`
  height:calc(100% - 20px);
`;

function Projects() {
  return (
    <Wrap>
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <AddProyectBtn>+ NUEVO PROYECTO</AddProyectBtn>
            <Title>
              PROYECTOS
            </Title>
          </FlexWrapRight>
          <Table>
            <HeadRowMonsterrat>
              <Col>NOMBRE</Col><Col>CLIENTE</Col><Col>EXPEDIENTE</Col><Col>N°OC</Col><Col>CONTRATO</Col>
            </HeadRowMonsterrat>
            <ScrollBoxFullHeight>
              <Row className="active">
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>CONJUNTO SOPORTE</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>CONJUNTO SOPORTE</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>CONJUNTO SOPORTE</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row><Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>CONJUNTO SOPORTE</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>CONJUNTO SOPORTE</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
              <Row>
                <Col>ANILLOS 2018</Col><Col>NA-SA</Col><Col>41955</Col><Col>4500107165</Col><Col title="OXF691198C305eaDc10c295420 2eA6b0BB38A76B43">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col>
              </Row>
            </ScrollBoxFullHeight>
          </Table>
        </Left>
        <Right>
          <ResumenTit>
            RESUMEN DE PROYECTO
          </ResumenTit>
          <ResumenName>
            ANILLOS 2018
          </ResumenName>
          <Row>
            <Col2 className="color">CLIENTE</Col2><Col2 className="bold">NA-SA</Col2>
          </Row>
          <Row>
            <Col2 className="color">EXPEDIENTE</Col2><Col2 className="bold">41955</Col2>
          </Row>
          <Row>
            <Col2 className="color">APROBACIÓN</Col2><Col2 className="bold">17/09/2019 - 11:31</Col2>
          </Row>
          <Row>
            <Col2 className="color">Nº OC</Col2><Col2 className="bold">4500107165</Col2>
          </Row>
          <Row>
            <Col2 className="color">CONTRATO</Col2><Col2 className="bold">OXF691198C305eaDc10c295420 2eA6b0BB38A76B43</Col2>
          </Row>
          <ProcesosTit>
            PROCESOS
          </ProcesosTit>
          <HeadRow>
              <Col3>NOMBRE</Col3><Col3>PROVEEDOR</Col3><Col3>DOCUMENTOS</Col3>
          </HeadRow>
          <Row>
              <Col3>MATERIA PRIMA</Col3><Col3>BGH</Col3><Col3><a href=""><Eye />VER DOC.</a></Col3>
          </Row>
          <Row>
              <Col3>MECANIZADO</Col3><Col3>IMECO</Col3><Col3><a href=""><Eye />VER DOC.</a></Col3>
          </Row>
          <Row>
              <Col3>PLATEADO</Col3><Col3>NRS</Col3><Col3><a href=""><Eye />VER DOC.</a></Col3>
          </Row>
          <Button>+ AGREGAR PROCESOS</Button>
        </Right>
      </FlexWrap>
      <Modal/>
    </Wrap>
  );
}
export default Projects;