// modal.js
import React, { useEffect, useState, useContext } from 'react';
import { Button } from '../styles/components';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { useForm } from 'react-hook-form';
import OutsideClickHandler from 'react-outside-click-handler';
import {
  ModalWrap,
  ModalTop,
  ModalTit,
  ModalTxt,
  ModalProdName,
  ModalBottom,
  ScrollBox130,
} from '../styles/processModal';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { getUserDetails, getAllUsers } from '../utils/web3Helpers';

function ClientModal(props) {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();
  const { web3, contract, account } = useContext(UserContext);
  const [txHash, setTxHash] = useState(undefined);
  const [users, setUsers] = useState([]);

  function onSubmit(data) {
    contract.methods
      .assignClient(props.project[1], data.userAddress)
      .send({ from: account.address })
      .on('transactionHash', (txHash) => setTxHash(txHash));
  }

  useEffect(() => {
    getAllUsers(contract, account.address)
      .then(getUserDetails(account.address, contract, undefined, web3))
      .then(setUsers);
    // eslint-disable-next-line
  }, []);

  return (
    <OutsideClickHandler onOutsideClick={props.closeModal} display="contents">
      <ModalWrap>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalTop>
            <ModalTit>ASIGNAR CLIENTE</ModalTit>
            <ModalTxt>ELEGIR CLIENTE A ASIGNAR</ModalTxt>
            <ModalProdName>{props.project[3]}</ModalProdName>
          </ModalTop>
          <ModalBottom>
            <HeadRow>
              <Col4>NAME</Col4>
              <Col4>ADDRESS</Col4>
            </HeadRow>
            <ScrollBox130>
              {users
                .filter((user) => user[1] === '1')
                .map((user) => (
                  <Row key={user[3]}>
                    <input
                      type="radio"
                      style={{
                        width: '15px',
                        height: '15px',
                        marginRight: '10px',
                      }}
                      id={user[3]}
                      name="userAddress"
                      value={user[3]}
                      ref={register}
                    />
                    <Col4>{user[2]}</Col4>
                    <Col4>{user[3]}</Col4>
                  </Row>
                ))}
            </ScrollBox130>
            <Button type="submit">
              {txHash ? t('processModal:success') : t('processModal:submit')}
            </Button>
          </ModalBottom>
        </form>
      </ModalWrap>
    </OutsideClickHandler>
  );
}
export default ClientModal;
