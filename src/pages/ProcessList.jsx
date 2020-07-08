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
import Process from '../build/contracts/Process.json';
import RSKLink from '../components/RSKLink';
import { UserContext } from '../context/UserContext';

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const { account, web3, contract } = useContext(UserContext);

  useEffect(() => {
    async function getProcessList() {
      const processes = await contract.methods
        .getProcessesByAddress()
        .call({ from: account.address });
      Promise.all(
        processes.map((address) => {
          let processContract = new web3.eth.Contract(Process.abi, address);
          return processContract.methods
            .getDetails()
            .call({ from: account.address });
        })
      ).then((processes) => {
        // TODO: Extract getUserName Logic
        Promise.all(
          processes.map(async (process) => {
            return {
              ...process,
              '0': await contract.methods
                .getUser(process[0])
                .call({ from: account.address }),
            };
          })
        ).then((processes) => setProcesses(processes));
      });
    }
    getProcessList();
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
