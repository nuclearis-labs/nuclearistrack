// processes.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as Pen } from '../img/pen.svg';
import Footer from '../components/Footer';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';
import RSKLink from '../components/RSKLink';

function ProcessList() {
  const [web3, contract] = useWeb3();
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    async function getProcessList() {
      const msgSender = await web3.eth.getCoinbase();
      const processes = await contract.methods
        .getProcessesByAddress()
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
    if (web3 && contract) getProcessList();
  }, [web3, contract]);

  return (
    <>
      <LoggedHeader />
      <Top>
        <Title>PROCESOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col4>NOMBRE</Col4>
            <Col4>PROVEEDOR</Col4>
            <Col4>VER DOC.</Col4>
            <Col4>AGREGAR DOC.</Col4>
            <Col4>CONTRACT</Col4>
          </HeadRow>
          {processes.length === 0 ? (
            <Row>
              <Col4 style={{ textAlign: 'center', width: '100%' }}>
                No hay procesos cargados para usted
              </Col4>
            </Row>
          ) : (
            processes.map((process) => (
              <Row key={process[3]}>
                <Col4>{web3.utils.hexToAscii(process[1])}</Col4>
                <Col4>{web3.utils.hexToAscii(process[0][2])}</Col4>
                <Col4>
                  <Link to={'/documents/' + process[3]}>
                    <Eye />
                    VER DOC.
                  </Link>
                </Col4>

                <Col4>
                  <Link to={'/documents/add/' + process[3]}>
                    <Pen />
                    AGREGAR DOC.
                  </Link>
                </Col4>
                <Col4>
                  <RSKLink hash={process[3]} type="address" testnet />
                </Col4>
              </Row>
            ))
          )}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}

export default ProcessList;
