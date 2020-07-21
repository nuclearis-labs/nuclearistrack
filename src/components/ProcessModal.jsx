// modal.js
import React, { useEffect, useState, useContext } from 'react';
import { Button } from '../styles/components';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import OutsideClickHandler from 'react-outside-click-handler';
import TxTrack from '../components/TxTrack';
import {
  ModalWrap,
  ModalTop,
  ModalTit,
  ModalInput,
  ModalTxt,
  ModalProdName,
  ModalBottom,
  Backdrop,
  ScrollBox130,
} from '../styles/processModal';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import {
  getProcessDetails,
  getUserDetails,
  getProcessesByAddress,
} from '../utils/web3Helpers';

function ProcessModal(props) {
  const { t } = useTranslation();
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
    getProcessesByAddress(contract, account.address)
      .then(getProcessDetails(account.address, web3))
      .then(getUserDetails(account.address, contract, 0, web3))
      .then(setProcesses);
    // eslint-disable-next-line
  }, []);

  return (
    <Backdrop>
      <OutsideClickHandler onOutsideClick={props.closeModal} display="contents">
        {txHash ? (
          <ModalWrap color="#FFF">
            <TxTrack tx={txHash} />
          </ModalWrap>
        ) : (
          <ModalWrap color="#333">
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalTop>
                <ModalTit>{t('processModal:title')}</ModalTit>
                <ModalInput placeholder="BUSCAR" ref={register}></ModalInput>
                <ModalTxt>{t('processModal:explainer')}</ModalTxt>
                <ModalProdName>{props.project[3]}</ModalProdName>
              </ModalTop>
              <ModalBottom>
                <HeadRow>
                  <Col4>{t('processModal:name')}</Col4>
                  <Col4>{t('processModal:supplier')}</Col4>
                  <Col4>{t('processModal:documents')}</Col4>
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
                      <Col4>{process[1]}</Col4>
                      <Col4>{process[0][2]}</Col4>
                      <Col4>
                        <Link to={'/documents/' + process[3]}>
                          <Eye />
                          {t('processModal:view')}
                        </Link>
                      </Col4>
                    </Row>
                  ))}
                </ScrollBox130>
                <Button type="submit">
                  {txHash
                    ? t('processModal:success')
                    : t('processModal:submit')}
                </Button>
              </ModalBottom>
            </form>
          </ModalWrap>
        )}
      </OutsideClickHandler>
    </Backdrop>
  );
}
export default ProcessModal;
