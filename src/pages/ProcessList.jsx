// processes.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Title, ScrollBox400 } from '../styles/components';
import { Top } from '../styles/form';
import {
  Table,
  TableBody,
  TableWrap,
  TableButton,
  Row,
  HeadRowMonsterrat,
  Col,
  CenteredCol
} from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as Pen } from '../img/pen.svg';
import RSKLink from '../components/RSKLink';
import { UserContext } from '../context/UserContext';
import {
  getProcessDetails,
  getUserDetails,
  getProcessesByAddress,
} from '../utils/web3Helpers';
import { useTranslation } from 'react-i18next';

function ProcessList() {
  const { t } = useTranslation();
  const [processes, setProcesses] = useState([]);
  const { account, web3, contract } = useContext(UserContext);

  useEffect(() => {
    getProcessesByAddress(contract, account.address)
      .then(getProcessDetails(account.address, web3))
      .then(getUserDetails(account.address, contract, 0, web3))
      .then(setProcesses);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Top>
        <Title>{t('processList:title')}</Title>
      </Top>
      <TableWrap>
      <Table>
        <HeadRowMonsterrat>
          <Col>{t('processList:name')}</Col>
          <Col>{t('processList:supplier')}</Col>
          <Col>{t('processList:contract')}</Col>
          <Col>{t('processList:documents')}</Col>
        </HeadRowMonsterrat>
        <TableBody>
          {processes.length === 0 ? (
            <Row>
              <CenteredCol colSpan="4">{t('processList:noItems')}</CenteredCol>
            </Row>
          ) : (
            processes.map((process) => (
              <Row key={process[3]}>
                <Col>{process[1]}</Col>
                <Col>{process[0][2]}</Col>
                <Col>
                  <RSKLink hash={process[3]} type="address" testnet />
                </Col>
                <Col>
                <TableButton as={Link} to={'/documents/' + process[3]} style={{marginRight:"10px"}}>VER</TableButton>
                <TableButton as={Link} to={'/documents/add/' + process[3]}>AGREGAR</TableButton>
                </Col>
              </Row>
            ))
          )}
        </TableBody>
      </Table>
      </TableWrap>
    </>
  );
}

export default ProcessList;
