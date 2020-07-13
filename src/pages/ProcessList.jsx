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

function ProcessList() {
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
        <Title>PROCESOS</Title>
      </Top>
      <TableWrap>
        <Table>
          <HeadRowMonsterrat>
            <Col>NOMBRE</Col>
            <Col>PROVEEDOR</Col>
            <Col>VER DOC.</Col>
            <Col>AGREGAR DOC.</Col>
            <Col>CONTRACT</Col>
          </HeadRowMonsterrat>
          <ScrollBox400>
            {processes.length === 0 ? (
              <Row>
                <Col style={{ textAlign: 'center', width: '100%' }}>
                  No hay procesos cargados para usted
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
                      VER DOC.
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
                      AGREGAR DOC.
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
