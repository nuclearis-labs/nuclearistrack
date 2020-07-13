import React, { useState, useEffect, useContext } from 'react';
import { Title, Label, Input, Button, Select } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import I18n from '../i18n';
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

export default function NewProject() {
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
            {web3.utils.hexToAscii(user[2]).replace(/\0/g, '')}
          </option>
        ))}
      </>
    );
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {txHash ? (
            <TxTrack tx={txHash} />
          ) : (
            <>
              <Label>
                <I18n t="forms.projectTitle" />
              </Label>
              <Input type="text" ref={register} name="proyectoTitle"></Input>
              <ErrorForm>
                {errors.proyectoTitle && errors.proyectoTitle.message}
              </ErrorForm>
              <Label>
                <I18n t="forms.client" />
              </Label>
              <Select name="clientAddress" defaultValue="" ref={register}>
                <option disabled hidden value="">
                  Select one...
                </option>
                <UserSelectList />
              </Select>
              <ErrorForm>
                {errors.clientAddress && errors.clientAddress.message}
              </ErrorForm>
              <Label>
                <I18n t="forms.expediente" />
              </Label>
              <Input type="text" name="expediente" ref={register}></Input>
              <ErrorForm>
                {errors.expediente && errors.expediente.message}
              </ErrorForm>
              <Label>
                <I18n t="forms.oc" />
              </Label>
              <Input ref={register} name="oc"></Input>
              <ErrorForm>{errors.oc && errors.oc.message}</ErrorForm>
              <Button type="submit">CREAR</Button>
            </>
          )}
        </Form>
      </FormWrap>
    </>
  );
}
