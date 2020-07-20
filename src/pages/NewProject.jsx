import React, { useState, useEffect, useContext } from 'react';
import { Title, Label, Input, Button, Select } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import { useForm } from 'react-hook-form';
import { ProjectSchema } from '../validationSchemas/index';
import TxTrack from '../components/TxTrack';
import { UserContext } from '../context/UserContext';
import {
  getUserDetails,
  filter,
  getAllUsers,
  createProject,
} from '../utils/web3Helpers';
import { useTranslation } from 'react-i18next';

export default function NewProject() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [txHash, setTxHash] = useState(undefined);
  const { account, web3, contract } = useContext(UserContext);
  const { register, handleSubmit, errors } = useForm({
    validationSchema: ProjectSchema,
  });

  useEffect(() => {
    getAllUsers(contract, account.address)
      .then(getUserDetails(account.address, contract, undefined, web3))
      .then(filter((user) => user[1] === '1'))
      .then(setUsers)
      .catch((e) => console.error(e));

    // eslint-disable-next-line
  }, []);

  function onSubmit(data) {
    createProject(contract, data, web3, account.address).on(
      'transactionHash',
      (txHash) => setTxHash(txHash)
    );
  }

  function UserSelectList() {
    return (
      <>
        {users.map((user) => (
          <option key={user[3]} value={user[3]}>
            {user[2]}
          </option>
        ))}
      </>
    );
  }

  return (
    <>
      <Top>
        <Title>{t('newProject:title')}</Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {txHash ? (
            <TxTrack tx={txHash} />
          ) : (
            <>
              <Label>{t('newProject:name')}</Label>
              <Input type="text" ref={register} name="proyectoTitle"></Input>
              <ErrorForm>
                {errors.proyectoTitle && errors.proyectoTitle.message}
              </ErrorForm>
              <Label>{t('newProject:client')}</Label>
              <Select name="clientAddress" defaultValue="" ref={register}>
                <option disabled hidden value="">
                  {t('newProject:selectOne')}
                </option>
                <UserSelectList />
              </Select>
              <ErrorForm>
                {errors.clientAddress && errors.clientAddress.message}
              </ErrorForm>
              <Label>{t('newProject:expediente')}</Label>
              <Input type="text" name="expediente" ref={register} />
              <ErrorForm>
                {errors.expediente && errors.expediente.message}
              </ErrorForm>
              <Label>{t('newProject:oc')}</Label>
              <Input ref={register} name="oc"></Input>
              <ErrorForm>{errors.oc && errors.oc.message}</ErrorForm>
              <Button type="submit">{t('newProject:submit')}</Button>
            </>
          )}
        </Form>
      </FormWrap>
    </>
  );
}
