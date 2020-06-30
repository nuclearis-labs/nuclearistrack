// newProvider.js
import React, { useState } from 'react';
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
  // const { drizzle, initialized } = useContext(DrizzleContext.Context);
  // const state = drizzle.store.getState();
  const [showModal, setShowModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const [processes] = useState(null);
  // useEffect(() => {
  //   if (initialized)
  //     drizzle.contracts.NuclearPoE.methods
  //       .getProjectsByAddress(state.accounts[0])
  //       .call({ from: state.accounts[0] })
  //       .then((projects) => {
  //         console.log(projects);

  //         const arr = projects.map((project) =>
  //           drizzle.contracts.NuclearPoE.methods
  //             .getProjectDetails(project)
  //             .call()
  //         );
  //         Promise.all(arr).then((project) => {
  //           console.log(project);

  //           setProjectDetails(project);
  //         });
  //       })
  //       .catch((error) => console.error(error));
  // }, [initialized, state.accounts, drizzle.contracts.NuclearPoE.methods]);

  function handleRowClick(project) {
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
              {projectDetails &&
                projectDetails.map((project) => (
                  <Row onClick={handleRowClick}>
                    {/* <Col>{drizzle.web3.utils.hexToAscii(project[2])}</Col>
                    <Col>{project[1]}</Col>
                    <Col>id</Col>
                    <Col>{drizzle.web3.utils.hexToAscii(project[3])}</Col>
                    <Col>{project[0] === 1 ? 'Activo' : 'Cerrado'}</Col> */}
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
            {processes &&
              processes.map((process: IProcess) => (
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
