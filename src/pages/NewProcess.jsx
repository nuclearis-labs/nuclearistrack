// newProvider.js
import React, { useEffect, useState } from 'react';
import { Title, Label, Input, Select, Button } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { ProcessSchema } from '../validationSchemas/index';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';
import RSKLink from '../components/RSKLink';
import { Link } from 'react-router-dom';

export default function NewProcess() {
  const [web3, contract] = useWeb3();
  const [users, setUsers] = useState([]);
  const [txHash, setTxHash] = useState(undefined);

  const { register, handleSubmit, errors } = useForm({
    validationSchema: ProcessSchema,
  });

  // TODO: Extract to custom hook or reusable function
  useEffect(() => {
    async function getUserList() {
      const msgSender = await web3.eth.getCoinbase();
      const addresses = await contract.methods
        .getAllUsers()
        .call({ from: msgSender });
      Promise.all(
        addresses.map((address) =>
          contract.methods.getUser(address).call({ from: msgSender })
        )
      ).then((users) => setUsers(users.filter((user) => user[1] === '2')));
    }
    if (web3 && contract) getUserList().catch(console.error);
  }, [web3, contract]);

  function onSubmit(data) {
    web3.eth.getCoinbase().then((msgSender) => {
      contract.methods
        .createProcess(
          data.supplierAddress,
          web3.utils.asciiToHex(data.processTitle)
        )
        .send({ from: msgSender })
        .on('transactionHash', (txHash) => setTxHash(txHash));
    });
  }

  return (
    <>
      <LoggedHeader />
      <Top>
        <Title>
          <I18n t="forms.newProcess" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {txHash ? (
            <>
              <Label>EXITO</Label>
              <p>
                Transaccion fue enviada con exito a la Blockchain, puede tardar
                varios minutos en ser confirmada.
              </p>
              <div>
                Transaction Hash: <RSKLink hash={txHash} testnet type="tx" />
              </div>
              <Button as={Link} to="/processes">
                VER PROCESOS
              </Button>
            </>
          ) : (
            <>
              <Label>
                <I18n t="forms.name" />
              </Label>
              <Input ref={register} name="processTitle"></Input>
              <ErrorForm>
                {errors.processTitle && errors.processTitle.message}
              </ErrorForm>
              <Label>
                <I18n t="forms.supplier" />
              </Label>
              <Select ref={register} name="supplierAddress" defaultValue="">
                <option disabled hidden value="">
                  Select one...
                </option>
                {users.map((user) => (
                  <option key={user[3]} value={user[3]}>
                    {web3.utils.hexToAscii(user[2])}
                  </option>
                ))}
              </Select>
              <ErrorForm>
                {errors.supplierAddress && errors.supplierAddress.message}
              </ErrorForm>
              <Button type="submit">CREAR</Button>
            </>
          )}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
