import React, { useState, useContext } from 'react';
import { Title, Label, Button, Input } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import { useForm } from 'react-hook-form';
import { UserSchema } from '../validationSchemas/index';
import { UserContext } from '../context/UserContext';
import TxTrack from '../components/TxTrack';
import { useTranslation } from 'react-i18next';

export default function NewUser() {
  const { t } = useTranslation();
  const [txHash, setTxHash] = useState(undefined);
  const { account, contract } = useContext(UserContext);

  const { register, handleSubmit, errors } = useForm({
    validationSchema: UserSchema,
  });

  function onSubmit(data) {
    contract.methods
      .createUser(data.newUserType, data.newUserAddress, data.newUserName)
      .send({ from: account.address })
      .on('transactionHash', (txHash) => setTxHash(txHash));
  }

  return (
    <>
      <Top>
        <Title>{t('newUser:title')}</Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {txHash ? (
            <TxTrack tx={txHash} />
          ) : (
            <>
              <Label>{t('newUser:name')}</Label>
              <Input type="text" ref={register} name="newUserName"></Input>
              <ErrorForm>
                {errors.newUserName && errors.newUserName.message}
              </ErrorForm>
              <Label>{t('newUser:address')}</Label>
              <Input type="text" ref={register} name="newUserAddress"></Input>
              <ErrorForm>
                {errors.newUserAddress && errors.newUserAddress.message}
              </ErrorForm>
              <Label>{t('newUser:type')}</Label>
              <div>
                <Input
                  style={{ width: '20px', height: 'unset' }}
                  type="radio"
                  ref={register}
                  name="newUserType"
                  value="1"
                  id="client"
                ></Input>
                <label htmlFor="client"> {t('newUser:client')}</label>
              </div>
              <div>
                <Input
                  style={{ width: '20px', height: 'unset' }}
                  type="radio"
                  ref={register}
                  name="newUserType"
                  value="2"
                  id="supplier"
                ></Input>
                <label htmlFor="supplier"> {t('newUser:supplier')}</label>
              </div>
              <ErrorForm>
                {errors.newUserType && errors.newUserType.message}
              </ErrorForm>
              <Button type="submit">{t('newUser:submit')}</Button>
            </>
          )}
        </Form>
      </FormWrap>
    </>
  );
}
