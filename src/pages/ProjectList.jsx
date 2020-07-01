// newProvider.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ProcessModal from '../components/ProcessModal';
import { Title, Button, Scroll } from '../styles/components';
import {
  Table,
  Row,
  HeadRow,
  HeadRowMonsterrat,
  Col,
  Col2,
  Col3,
} from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import Footer from '../components/Footer';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';

const FlexWrap = styled.div`
  display: flex;
`;
const FlexWrapRight = styled(FlexWrap)`
  float: ${(props) => (props.details && props.details.id ? 'right' : 'left')};
  padding-right: ${(props) =>
    props.details && props.details.id ? '20px' : '0px'};
  padding-left: ${(props) =>
    props.details && props.details.id ? '0px' : '37%'};
`;

const Left = styled.div`
  padding: 0;
  width: ${(props) => (props.details && props.details.id ? '60%' : '100%')};
  background: #fff;
  min-width: 461px;
  ${Row} {
    padding: 4px 60px;
  }
`;
const appear = keyframes`
from {
  opacity:0;
}
to {
  opacity: 1;
}`;

const Right = styled.div`
  padding: 30px 40px;
  width: 40%;
  background: #ccc;
  min-width: 307px;
  text-align: left;
  box-sizing: border-box;
  animation: ${appear} 500ms;
  animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
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

export default function ProjectList() {
  const [web3, contract] = useWeb3();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [processes] = useState(null);

  useEffect(() => {
    async function getProjectList() {
      const msgSender = await web3.eth.getCoinbase();
      const projects = await contract.methods
        .getProjectsByAddress()
        .call({ from: msgSender });
      Promise.all(
        projects.map((project) =>
          contract.methods.getProjectDetails(project).call({ from: msgSender })
        )
      ).then((project) => setProjects(project));
    }
    if (web3 && contract) getProjectList();
  }, [web3, contract]);

  useEffect(() => {
    if (
      web3 &&
      projects &&
      projects.length > 0 &&
      !projects[0].hasOwnProperty('userName')
    )
      web3.eth.getCoinbase().then((msgSender) => {
        const newProject = projects.map(async (project) => {
          const user = await contract.methods
            .getUser(project[2])
            .call({ from: msgSender });
          return { ...project, userName: user[2] };
        });
        Promise.all(newProject).then((projects) => {
          setProjects(projects);
        });
      });
    // eslint-disable-next-line
  }, [web3, projects]);

  function handleRowClick(project) {
    console.log(project);

    setProjectDetails(project);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <LoggedHeader />
      <FlexWrap>
        <Left details={projectDetails}>
          <FlexWrapRight details={projectDetails}>
            <AddProyectBtn>+ NUEVO PROYECTO</AddProyectBtn>
            <Title>PROYECTOS</Title>
          </FlexWrapRight>
          <Table>
            <HeadRowMonsterrat>
              <Col>NOMBRE</Col>
              <Col>CLIENTE</Col>
              <Col>EXPEDIENTE</Col>
              <Col>N°OC</Col>
              <Col>ESTADO</Col>
            </HeadRowMonsterrat>
            <ScrollBox400>
              {projects && projects.length === 0 ? (
                <Row>
                  <Col style={{ textAlign: 'center', width: '100%' }}>
                    No hay projectos cargados para usted
                  </Col>
                </Row>
              ) : (
                projects[0].hasOwnProperty('userName') &&
                projects.map((project) => (
                  <Row key={project[1]} onClick={() => handleRowClick(project)}>
                    <Col>{web3.utils.hexToAscii(project[3])}</Col>
                    <Col>{web3.utils.hexToAscii(project.userName)}</Col>
                    <Col>{project[1]}</Col>
                    <Col>{web3.utils.hexToAscii(project[4])}</Col>
                    <Col>{project[0] === '1' ? 'Activo' : 'Cerrado'}</Col>
                  </Row>
                ))
              )}
            </ScrollBox400>
          </Table>
        </Left>
        {projectDetails && (
          <Right>
            <ResumenTit>RESUMEN DE PROYECTO</ResumenTit>
            <ResumenName>
              {web3.utils.hexToAscii(projectDetails[3])}
            </ResumenName>
            <Row>
              <Col2 className="color">CLIENTE</Col2>
              <Col2 className="bold">
                {web3.utils.hexToAscii(projectDetails.userName)}
              </Col2>
            </Row>
            <Row>
              <Col2 className="color">EXPEDIENTE</Col2>
              <Col2 className="bold">{projectDetails[1]}</Col2>
            </Row>
            <Row>
              <Col2 className="color">Nº OC</Col2>
              <Col2 className="bold">
                {web3.utils.hexToAscii(projectDetails[4])}
              </Col2>
            </Row>
            <ProcesosTit>PROCESOS</ProcesosTit>
            <HeadRow>
              <Col3>NOMBRE</Col3>
              <Col3>PROVEEDOR</Col3>
              <Col3>DOCUMENTOS</Col3>
            </HeadRow>
            {processes &&
              processes.map((process) => (
                <Row>
                  <Col3>{process.processName}</Col3>
                  <Col3>{process.supplierName}</Col3>
                  <Col3>
                    <Link to={'/documents/' + process.contractAddress}>
                      <Eye />
                      VER DOC.
                    </Link>
                  </Col3>
                </Row>
              ))}
            <Button
              style={{ width: 'fit-content' }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              + AGREGAR PROCESOS
            </Button>
          </Right>
        )}
      </FlexWrap>
      {showModal && (
        <ProcessModal project={projectDetails} closeModal={closeModal} />
      )}
      <Footer />
    </>
  );
}
