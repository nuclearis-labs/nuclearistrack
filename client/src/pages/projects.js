// newProvider.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../components/modal.js';
import { Title, Button, Wrap, Scroll } from '../components/components.js';
import {
  Table,
  Row,
  HeadRow,
  HeadRowMonsterrat,
  Col,
  Col2,
  Col3
} from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';

const FlexWrap = styled.div`
  display: flex;
`;
const FlexWrapRight = styled(FlexWrap)`
  float: right;
  padding-right: 20px;
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
const Right = styled.div`
  padding: 30px 40px;
  width: 40%;
  background: #ccc;
  min-width: 307px;
  text-align: left;
  box-sizing: border-box;
`;
const AddProyectBtn = styled.a`
  color: #8c6239;
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
  padding: 40px 20px 0 20px;
  cursor: pointer;
  :hover {
    color: #000;
  }
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

const ResumenName = styled.div`
  color: #333;
  font-weight: 700;
  font-size: 23px;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const ScrollBox400 = styled(Scroll)`
  height: 400px;
`;

function Projects() {
  const projectsArray = [
    {
      nombre: 'Anillos 2018',
      cliente: 'NA-SA',
      expediente: '41955',
      oc: '4500107165'
    },
    {
      nombre: 'Conjuntos Soporte',
      cliente: 'NA-SA',
      expediente: '54534',
      oc: '4534534545'
    }
  ];

  const [showModal, setShowModal] = useState(false);
  return (
    <Wrap>
      <FlexWrap>
        <Left>
          <FlexWrapRight>
            <AddProyectBtn as={Link} to="/projects/add">+ NUEVO PROYECTO</AddProyectBtn>
            <Title>PROYECTOS</Title>
          </FlexWrapRight>
          <Table>
            <HeadRowMonsterrat>
              <Col>NOMBRE</Col>
              <Col>CLIENTE</Col>
              <Col>EXPEDIENTE</Col>
              <Col>N°OC</Col>
            </HeadRowMonsterrat>
            <ScrollBox400>
              {projectsArray.map(project => (
                <Row
                  onClick={() => {
                    console.log(project);
                  }}
                >
                  <Col>{project.nombre}</Col>
                  <Col>{project.cliente}</Col>
                  <Col>{project.expediente}</Col>
                  <Col>{project.oc}</Col>
                </Row>
              ))}
            </ScrollBox400>
          </Table>
        </Left>
        <Right>
          <ResumenTit>RESUMEN DE PROYECTO</ResumenTit>
          <ResumenName>ANILLOS 2018</ResumenName>
          <Row>
            <Col2 className="color">CLIENTE</Col2>
            <Col2 className="bold">NA-SA</Col2>
          </Row>
          <Row>
            <Col2 className="color">EXPEDIENTE</Col2>
            <Col2 className="bold">41955</Col2>
          </Row>
          <Row>
            <Col2 className="color">APROBACIÓN</Col2>
            <Col2 className="bold">17/09/2019 - 11:31</Col2>
          </Row>
          <Row>
            <Col2 className="color">Nº OC</Col2>
            <Col2 className="bold">4500107165</Col2>
          </Row>
          <Row>
            <Col2 className="color">CONTRATO</Col2>
            <Col2 className="bold">
              OXF691198C305eaDc10c295420 2eA6b0BB38A76B43
            </Col2>
          </Row>
          <ProcesosTit>PROCESOS</ProcesosTit>
          <HeadRow>
            <Col3>NOMBRE</Col3>
            <Col3>PROVEEDOR</Col3>
            <Col3>DOCUMENTOS</Col3>
          </HeadRow>
          <Row>
            <Col3>MATERIA PRIMA</Col3>
            <Col3>BGH</Col3>
            <Col3>
              <a href="">
                <Eye />
                VER DOC.
              </a>
            </Col3>
          </Row>
          <Row>
            <Col3>MECANIZADO</Col3>
            <Col3>IMECO</Col3>
            <Col3>
              <a href="">
                <Eye />
                VER DOC.
              </a>
            </Col3>
          </Row>
          <Row>
            <Col3>PLATEADO</Col3>
            <Col3>NRS</Col3>
            <Col3>
              <a href="">
                <Eye />
                VER DOC.
              </a>
            </Col3>
          </Row>
          <Button
            onClick={() => {
              setShowModal(true);
            }}
          >
            + AGREGAR PROCESOS
          </Button>
        </Right>
      </FlexWrap>
      {showModal && <Modal />}
    </Wrap>
  );
}
export default Projects;
