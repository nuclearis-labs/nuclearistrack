// newProvider.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProcessModal from '../components/ProcessModal';
import ClientModal from '../components/ClientModal';
import { Title, Button } from '../styles/components';
import {
  TableBody,
  CenteredCol,
  TableButton,
  Table,
  TableWrap,
  Row,
  HeadRow,
  HeadRowMonsterrat,
  Col,
} from '../styles/tableComponents';
import {
  FlexWrap,
  Left,
  FlexWrapRight,
  AddProyectBtn,
  Right,
  ResumenTit,
  ResumenName,
  ProcesosTit,
} from '../styles/projectList';
import TxTrack from '../components/TxTrack';
import { UserContext } from '../context/UserContext';
import {
  getProcessDetails,
  getUserDetails,
  getProjectDetails,
  getProjectsByAddress,
} from '../utils/web3Helpers';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Loader } from '../img/puff.svg';

export default function ProjectList() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [projects, setProjects] = useState(undefined);
  const [projectDetails, setProjectDetails] = useState(null);
  const [processes, setProcesses] = useState(null);
  const [txHash, setTxHash] = useState(undefined);
  const { account, web3, contract } = useContext(UserContext);

  useEffect(() => {
    getProjectsByAddress(contract, account.address)
      .then(getProjectDetails(account.address, contract, web3))
      .then(getUserDetails(account.address, contract, 2, web3))
      .then(setProjects);
    //eslint-disable-next-line
  }, []);

  function handleRowClick(project) {
    setProjectDetails(project);
    contract.methods
      .getProcessContractsByProject(project[1])
      .call({ from: account.address })
      .then(getProcessDetails(account.address, web3))
      .then(getUserDetails(account.address, contract, 0, web3))
      .then(setProcesses);
  }

  function toggleProject(id) {
    contract.methods
      .toggleProjectStatus(id)
      .send({ from: account.address })
      .on('transactionHash', (txHash) => setTxHash(txHash));
  }

  function closeModal() {
    setShowModal(false);
  }

  function closeClientModal() {
    setShowClientModal(false);
  }

  return (
    <>
      <FlexWrap>
        <Left details={projectDetails}>
          <FlexWrapRight details={projectDetails}>
            {account.type === '0' && (
              <AddProyectBtn as={Link} to="/projects/add">
                + {t('projectList:new')}
              </AddProyectBtn>
            )}
            <Title>{t('projectList:projects')}</Title>
          </FlexWrapRight>
          <TableWrap>
            <Table>
              <HeadRowMonsterrat>
                <Col>{t('projectList:name')}</Col>
                <Col>{t('projectList:client')}</Col>
                <Col>{t('projectList:expediente')}</Col>
                <Col>{t('projectList:oc')}</Col>
                <Col>{t('projectList:state')}</Col>
                <Col>{t('projectList:details')}</Col>
              </HeadRowMonsterrat>
              <TableBody>
                {txHash ? (
                  <TxTrack tx={txHash} />
                ) : (
                  <>
                    {projects === undefined ? (
                      <tr
                        style={{
                          width: '100%',
                          margin: 'auto',
                          textAlign: 'center',
                        }}
                      >
                        <td colSpan="6">
                          <Loader />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {projects && projects.length === 0 ? (
                          <Row>
                            <CenteredCol colSpan="6">
                              {t('projectList:noItems')}
                            </CenteredCol>
                          </Row>
                        ) : (
                          projects.map((project) => (
                            <Row key={project[1]}>
                              <Col>{project[3]}</Col>
                              <Col>
                                {project[2][2] === '' ? '' : project[2][2]}
                              </Col>
                              <Col>{project[1]}</Col>
                              <Col>{project[4]}</Col>
                              <Col>
                                {account.type === '0' ? (
                                  <TableButton
                                    onClick={() => toggleProject(project[1])}
                                  >
                                    {project[0] === '1'
                                      ? t('projectList:active')
                                      : t('projectList:closed')}
                                  </TableButton>
                                ) : project[0] === '1' ? (
                                  t('projectList:active')
                                ) : (
                                  t('projectList:closed')
                                )}
                              </Col>
                              <Col>
                                <TableButton
                                  onClick={() => handleRowClick(project)}
                                >
                                  {t('projectList:view')}
                                </TableButton>
                              </Col>
                            </Row>
                          ))
                        )}
                      </>
                    )}{' '}
                  </>
                )}
              </TableBody>
            </Table>
          </TableWrap>
        </Left>

        {projectDetails && (
          <Right>
            <ResumenTit>{t('projectList:resumen')}</ResumenTit>
            <ResumenName>{projectDetails[3]}</ResumenName>
            <table cellpadding="2">
            <Row>
              <Col className="color">{t('projectList:client')}</Col>
              <Col className="bold">{projectDetails[2][2]}</Col>
            </Row>
            <Row>
              <Col style={{ width: '115px' }} className="color">
                {t('projectList:expediente')}
              </Col>
              <Col className="bold">{projectDetails[1]}</Col>
            </Row>
            <Row>
              <Col className="color">{t('projectList:oc')}</Col>
              <Col className="bold">{projectDetails[4]}</Col>
            </Row>
            </table>
            <ProcesosTit>{t('projectList:processes')}</ProcesosTit>
            <table cellpadding="2">
            <HeadRow>
              <Col>{t('projectList:name')}</Col>
              <Col>{t('projectList:supplier')}</Col>
              <Col></Col>
            </HeadRow>
            {processes &&
              processes.map((process) => (
                <Row key={process[3]}>
                  <Col>{process[1]}</Col>
                  <Col>{process[0][2]}</Col>
                  <Col>
                    <TableButton as={Link} to={'/documents/' + process[3]}>
                      {t('projectList:view')}
                    </TableButton>
                  </Col>
                </Row>
              ))}
              </table>
            {account.type === '0' && (
              <>
                <Button
                  style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  + {t('projectList:assignProcess')}
                </Button>

                <Button
                  style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setShowClientModal(true);
                  }}
                >
                  + {t('projectList:assignClient')}
                </Button>
              </>
            )}
          </Right>
        )}
      </FlexWrap>
      {showModal && (
        <ProcessModal project={projectDetails} closeModal={closeModal} />
      )}
      {showClientModal && (
        <ClientModal project={projectDetails} closeModal={closeClientModal} />
      )}
    </>
  );
}
