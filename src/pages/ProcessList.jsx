// processes.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Title, ScrollBox400 } from '../styles/components';
import { Top } from '../styles/form';
import {
  TableWrap,
  Table,
  Row,
  HeadRowMonsterrat,
  Col,
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
            <Col>{t('processList:view')}</Col>
            <Col>{t('processList:add')}</Col>
            <Col>{t('processList:contract')}</Col>
          </HeadRowMonsterrat>
          <ScrollBox400>
            {processes.length === 0 ? (
              <Row>
                <Col style={{ textAlign: 'center', width: '100%' }}>
                  {t('processList:noItems')}
                </Col>
              </Row>
            ) : (
              processes.map((process) => (
                <Row key={process[3]}>
                  <Col>{web3.utils.hexToAscii(process[1])}</Col>
                  <Col>{web3.utils.hexToAscii(process[0][2])}</Col>
                  <Col>
                    <Link to={'/documents/' + process[3]}>
                      <Eye
                        style={{
                          width: '20px',
                          verticalAlign: 'middle',
                          marginRight: '5px',
                          fill: '#333',
                        }}
                      />
                      {t('processList:view')}
                    </Link>
                  </Col>

                  <Col>
                    <Link to={'/documents/add/' + process[3]}>
                      <Pen
                        style={{
                          width: '20px',
                          verticalAlign: 'middle',
                          marginRight: '5px',
                          fill: '#333',
                        }}
                      />
                      {t('processList:add')}
                    </Link>
                  </Col>
                  <Col>
                    <RSKLink hash={process[3]} type="address" testnet />
                  </Col>
                </Row>
              ))
            )}
          </ScrollBox400>
        </Table>
      </TableWrap>
    </>
  );
}

export default ProcessList;
