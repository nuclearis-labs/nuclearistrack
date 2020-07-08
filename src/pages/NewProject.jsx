import React, { useState, useEffect, useContext } from 'react';
import { Title, Label, Input, Button, Select } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { ProjectSchema } from '../validationSchemas/index';
import TxTrack from '../components/TxTrack';
import { UserContext } from '../context/UserContext';

export default function NewProject() {
  const [users, setUsers] = useState([]);
  const [txHash, setTxHash] = useState(undefined);
  const { account, web3, contract } = useContext(UserContext);

  const { register, handleSubmit, errors } = useForm({
    validationSchema: ProjectSchema,
  });

  // TODO: Extract to custom hook or reusable function
  useEffect(() => {
    async function getUserList() {
      const addresses = await contract.methods
        .getAllUsers()
        .call({ from: account.address });
      Promise.all(
        addresses.map((address) =>
          contract.methods.getUser(address).call({ from: account.address })
        )
      ).then((users) => setUsers(users.filter((user) => user[1] === '1')));
    }
    getUserList().catch(console.error);
    // eslint-disable-next-line
  }, []);

  function onSubmit(data) {
    contract.methods
      .createProject(
        data.expediente,
        data.clientAddress,
        web3.utils.asciiToHex(data.proyectoTitle),
        web3.utils.asciiToHex(data.oc)
      )
      .send({ from: account.address })
      .on('transactionHash', (txHash) => setTxHash(txHash));
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
                {users.map((user) => (
                  <option key={user[3]} value={user[3]}>
                    {web3.utils.hexToAscii(user[2]).replace(/\0/g, '')}
                  </option>
                ))}
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
