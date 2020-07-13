// modal.js
import React, { useEffect, useState, useContext } from 'react';
import { Button } from '../styles/components';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import OutsideClickHandler from 'react-outside-click-handler';
import Process from '../build/contracts/Process.json';
import RSKLink from '../components/RSKLink';
import {
  ModalWrap,
  ModalTop,
  ModalTit,
  ModalInput,
  ModalTxt,
  ModalProdName,
  ModalBottom,
  ScrollBox130,
} from '../styles/processModal';
import { UserContext } from '../context/UserContext';

function ProcessModal(props) {
  const { register, handleSubmit } = useForm();
  const { web3, contract, account } = useContext(UserContext);
  const [processes, setProcesses] = useState([]);
  const [txHash, setTxHash] = useState(undefined);

  function onSubmit(data) {
    contract.methods
      .addProcessToProject(props.project[1], data.processContract)
      .send({ from: account.address })
      .on('transactionHash', (txHash) => setTxHash(txHash));
  }

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
        Promise.all(
          processes.map(async (process) => {
            return {
              ...process,
              '0': await contract.methods
                .getUser(process[0])
                .call({ from: account.address }),
            };
          })
        ).then((processes) => {
          setProcesses(processes);
        });
      });
    }
    getProcessList();
    // eslint-disable-next-line
  }, []);

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
            <ModalProdName>
              {web3.utils.hexToAscii(props.project[3])}
            </ModalProdName>
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
                  <Col4>{web3.utils.hexToAscii(process[0][2])}</Col4>
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
                ? ('EXITO! Tx:', (<RSKLink hash={txHash} testnet type="tx" />))
                : 'ASIGNAR PROCESO'}
            </Button>
          </ModalBottom>
        </form>
      </ModalWrap>
    </OutsideClickHandler>
  );
}
export default ProcessModal;
