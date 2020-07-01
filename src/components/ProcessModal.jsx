// modal.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Scroll, Button } from '../styles/components';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import OutsideClickHandler from 'react-outside-click-handler';
import Process from '../build/contracts/Process.json';
import useWeb3 from '../hooks/useWeb3';
import RSKLink from '../components/RSKLink';

const ModalWrap = styled.div`
  width: 540px;
  height: 350px;
  position: fixed;
  top: 320px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  z-index: 999999;
`;

const ModalTop = styled.div`
  width: 100%;
  height: 140px;
  color: #fff;
  padding: 30px 20px 10px 50px;
  box-sizing: border-box;
`;

const ModalBottom = styled.div`
  width: 100%;
  height: 210px;
  background: #999;
  color: #333;
  padding: 5px 20px 10px 30px;
  box-sizing: border-box;
  ${HeadRow} {
    width: calc(100% - 34px);
    margin-left: 20px;
  }
`;

const ModalTit = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 26px;
`;

const ModalInput = styled.input`
  font-family: 'Roboto Condensed', sans-serif;
  border: none;
  width: 190px;
  height: 23px;
  padding: 5px;
  color: #333;
  cursor: text;
  font-size: 13px;
  font-weight: 300;
  box-sizing: border-box;
  background: #e6e6e6;
  margin: 5px 0;
  &:active,
  &:focus {
    text-align: left;
  }
`;

const ModalTxt = styled.div`
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 1px;
  line-height: 20px;
`;

const ModalProdName = styled.div`
  font-weight: 700;
  font-size: 23px;
  letter-spacing: 1px;
  line-height: 20px;
  margin: 3px 0;
`;

const ScrollBox130 = styled(Scroll)`
  height: 115px;
  overflow: scroll;
`;

function ProcessModal(props) {
  const { register, handleSubmit } = useForm();
  const [web3, contract] = useWeb3();
  const [processes, setProcesses] = useState([]);
  const [txHash, setTxHash] = useState(undefined);

  function onSubmit(data) {
    web3.eth.getCoinbase().then((msgSender) =>
      contract.methods
        .addProcessToProject(props.project[1], data.processContract)
        .send({ from: msgSender })
        .on('transactionHash', (txHash) => setTxHash(txHash))
    );
  }

  useEffect(() => {
    if (
      web3 &&
      processes &&
      processes.length > 0 &&
      !processes[0].hasOwnProperty('userName')
    )
      web3.eth.getCoinbase().then((msgSender) => {
        const newProcess = processes.map(async (process) => {
          const user = await contract.methods
            .getUser(process[0])
            .call({ from: msgSender });
          return { ...process, userName: user[2] };
        });
        Promise.all(newProcess).then((process) => {
          console.log(process);

          setProcesses(process);
        });
      });
    // eslint-disable-next-line
  }, [web3, processes]);

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
        console.log(processes);

        setProcesses(processes);
      });
    }
    if (web3 && contract) getProcessList();
  }, [web3, contract]);

  if (web3)
    return (
      <OutsideClickHandler onOutsideClick={props.closeModal} display="contents">
        <ModalWrap>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalTop>
              <ModalTit>AGREGAR PROCESOS</ModalTit>
              <ModalInput placeholder="BUSCAR" ref={register}></ModalInput>
              <ModalTxt>
                SELECCIONE LOS PROCESOS QUE DESEA AGREGAR AL PROYECTO
              </ModalTxt>
              <ModalProdName>{props.project.title}</ModalProdName>
            </ModalTop>
            <ModalBottom>
              <HeadRow>
                <Col4>NOMBRE</Col4>
                <Col4>PROVEEDOR</Col4>
                <Col4>DOCUMENTOS</Col4>
              </HeadRow>
              <ScrollBox130>
                {processes.map((process) => (
                  <Row key={process[3]}>
                    <input
                      type="radio"
                      style={{
                        width: '15px',
                        height: '15px',
                        marginRight: '10px',
                      }}
                      id={process[3]}
                      name="processContract"
                      value={process[3]}
                      ref={register}
                    />
                    <Col4>{web3.utils.hexToAscii(process[1])}</Col4>
                    <Col4>
                      {process.hasOwnProperty('userName') &&
                        web3.utils.hexToAscii(process.userName)}
                    </Col4>
                    <Col4>
                      <Link to={'/documents/' + process[3]}>
                        <Eye />
                        VER DOC.
                      </Link>
                    </Col4>
                  </Row>
                ))}
              </ScrollBox130>
              <Button type="submit">
                {txHash
                  ? ('EXITO! Tx:',
                    (<RSKLink hash={txHash} testnet type="tx" />))
                  : 'ASIGNAR PROCESO'}
              </Button>
            </ModalBottom>
          </form>
        </ModalWrap>
      </OutsideClickHandler>
    );
  return null;
}
export default ProcessModal;
