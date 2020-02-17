// newProvider.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header.js';

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProcessModal from '../components/processModal.js';
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
import Footer from '../components/footer.js';

const FlexWrap = styled.div`
  display: flex;
`;
const FlexWrapRight = styled(FlexWrap)`
  float: ${props => (props.details.hasOwnProperty('id') ? 'right' : 'left')};
  padding-right: ${props =>
    props.details.hasOwnProperty('id') ? '20px' : '0px'};
  padding-left: ${props =>
    props.details.hasOwnProperty('id') ? '0px' : '37%'};
`;

const Left = styled.div`
  padding: 0;
  width: ${props => (props.details.hasOwnProperty('id') ? '60%' : '100%')};
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
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/project/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setProjects(data);
    });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [processes, setProcesses] = useState([]);

  function handleRowClick(project) {
    setProjectDetails(project);
    axios({
      method: 'get',
      url: '/api/process/getByExpediente?expediente=' + project.id,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setProcesses(data);
    });
  }

  return (
    <>
      <Header />
      <Wrap>
        <FlexWrap>
          <Left details={projectDetails}>
            <FlexWrapRight details={projectDetails}>
              <AddProyectBtn as={Link} to="/projects/add">
                + NUEVO PROYECTO
              </AddProyectBtn>
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
                {projects.map(project => (
                  <Row
                    onClick={() => {
                      handleRowClick(project);
                    }}
                  >
                    <Col>{project.title}</Col>
                    <Col>{project.clientName}</Col>
                    <Col>{project.id}</Col>
                    <Col>{project.oc}</Col>
                  </Row>
                ))}
              </ScrollBox400>
            </Table>
          </Left>
          {projectDetails && projectDetails.hasOwnProperty('id') && (
            <Right>
              <ResumenTit>RESUMEN DE PROYECTO</ResumenTit>
              <ResumenName>{projectDetails.title}</ResumenName>
              <Row>
                <Col2 className="color">CLIENTE</Col2>
                <Col2 className="bold">{projectDetails.clientName}</Col2>
              </Row>
              <Row>
                <Col2 className="color">EXPEDIENTE</Col2>
                <Col2 className="bold">{projectDetails.id}</Col2>
              </Row>
              <Row>
                <Col2 className="color">Nº OC</Col2>
                <Col2 className="bold">{projectDetails.oc}</Col2>
              </Row>
              <ProcesosTit>PROCESOS</ProcesosTit>
              <HeadRow>
                <Col3>NOMBRE</Col3>
                <Col3>PROVEEDOR</Col3>
                <Col3>DOCUMENTOS</Col3>
              </HeadRow>
              <Row>
                {processes.map(process => (
                  <>
                    <Col3>{process.processName}</Col3>
                    <Col3>{process.supplierName}</Col3>
                    <Col3>
                      <Link>
                        <Eye />
                        VER DOC.
                      </Link>
                    </Col3>
                  </>
                ))}
              </Row>
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
              >
                + AGREGAR PROCESOS
              </Button>
            </Right>
          )}
        </FlexWrap>
        {showModal && <ProcessModal project={projectDetails} />}
      </Wrap>
      <Footer />
    </>
  );
}
export default Projects;
