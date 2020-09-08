// processes.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top } from '../styles/form';
import {
  Table,
  TableBody,
  TableWrap,
  TableButton,
  Row,
  HeadRowMonsterrat,
  Col,
  CenteredCol,
} from '../styles/tableComponents';
import RSKLink from '../components/RSKLink';
import { UserContext } from '../context/UserContext';
import {
  getProcessDetails,
  getUserDetails,
  getProcessesByAddress,
} from '../utils/web3Helpers';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Loader } from '../img/puff.svg';

function ProcessList() {
  const { t } = useTranslation();
  const [processes, setProcesses] = useState(undefined);
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
            {processes === undefined ? (
              <tr
                style={{ width: '100%', margin: 'auto', textAlign: 'center' }}
              >
                <td colSpan="4">
                  <Loader />
                </td>
              </tr>
            ) : (
              <>
                {processes.length === 0 ? (
                  <Row>
                    <CenteredCol colSpan="4">
                      {t('processList:noItems')}
                    </CenteredCol>
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
                        <TableButton
                          as={Link}
                          to={'/documents/' + process[3]}
                          style={{ marginRight: '10px' }}
                        >
                          {t('processList:view')}
                        </TableButton>
                        <TableButton
                          as={Link}
                          to={'/documents/add/' + process[3]}
                        >
                          {t('processList:add')}
                        </TableButton>
                      </Col>
                    </Row>
                  ))
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableWrap>
    </>
  );
}

export default ProcessList;
