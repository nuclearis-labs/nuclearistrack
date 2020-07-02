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
import {
  FlexWrap,
  Left,
  FlexWrapRight,
  AddProyectBtn,
  ScrollBox400,
  Right,
  ResumenTit,
  ResumenName,
  ProcesosTit,
} from '../styles/projectList';
import { ReactComponent as Eye } from '../img/eye.svg';
import Footer from '../components/Footer';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';

export default function ProjectList() {
  const [web3, contract] = useWeb3();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [processes, setProcesses] = useState(null);

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
      ).then((projects) => {
        // TODO: Extract getUserName Logic
        Promise.all(
          projects.map(async (project) => {
            return {
              ...project,
              '2': await contract.methods
                .getUser(project[2])
                .call({ from: msgSender }),
            };
          })
        ).then((projects) => setProjects(projects));
      });
    }
    if (web3 && contract) getProjectList();
  }, [web3, contract]);

  function handleRowClick(project) {
    async function getProcessListByProject() {
      const msgSender = await web3.eth.getCoinbase();
      const processes = await contract.methods
        .getProcessContractsByProject(project[1])
        .call({ from: msgSender });
      Promise.all(
        processes.map((address) => {
          let processContract = new web3.eth.Contract(Process.abi, address);
          return processContract.methods.getDetails().call({ from: msgSender });
        })
      ).then((processes) => {
        // TODO: Extract getUserName Logic
        Promise.all(
          processes.map(async (process) => {
            return {
              ...process,
              '0': await contract.methods
                .getUser(process[0])
                .call({ from: msgSender }),
            };
          })
        ).then((processes) => setProcesses(processes));
      });
    }
    if (web3 && contract) {
      getProcessListByProject();
      setProjectDetails(project);
    }
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
                projects.map((project) => (
                  <Row key={project[1]} onClick={() => handleRowClick(project)}>
                    <Col>{web3.utils.hexToAscii(project[3])}</Col>
                    <Col>{web3.utils.hexToAscii(project[2][2])}</Col>
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
                {web3.utils.hexToAscii(projectDetails[2][2])}
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
                <Row key={process[3]}>
                  <Col3>{web3.utils.hexToAscii(process[1])}</Col3>
                  <Col3>{web3.utils.hexToAscii(process[0][2])}</Col3>
                  <Col3>
                    <Link to={'/documents/' + process[3]}>
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
