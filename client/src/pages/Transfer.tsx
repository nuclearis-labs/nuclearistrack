import React from 'react';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  PassphraseButton,
  PassphraseInput
} from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import axios from 'axios';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import I18n from '../i18n';
import useSWR from 'swr';
import Spinner from '../components/Spinner';
import { useAsync } from '../hooks/useAsync';
import { RouteProps } from 'react-router';
import { IUser } from '../types/user';
import { TransferSchema } from '../validationSchemas/index';

export default function Transfer(props: RouteProps) {
  const { register, handleSubmit, errors, getValues } = useForm({
    validationSchema: TransferSchema
  });
  const { execute, pending, value } = useAsync(onSubmit, false);
  const { data } = useSWR('/api/user/get', url =>
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(({ data }) => data)
  );

  function onSubmit() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/api/transfer',
        data: getValues(),
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.response.data));
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.transfer" />
        </Title>
      </Top>
      {value ? (
        <TransactionSuccess {...{ value }} />
      ) : (
        <FormWrap>
          <Form onSubmit={handleSubmit(execute)}>
            <Label>
              <I18n t="forms.user" />
            </Label>
            <Select ref={register} name="to" defaultValue="">
              <option disabled hidden value="">
                {I18n.getTranslation(props.location, 'forms.selectOne')}
              </option>
              {data &&
                data.map((user: IUser) => (
                  <option key={user.address} value={user.address}>
                    {user.username}
                  </option>
                ))}
            </Select>
            <ErrorForm>{errors.to && errors.to.message}</ErrorForm>
            <Label>
              <I18n t="forms.amount" />
            </Label>
            <Input name="value" ref={register} type="number"></Input>
            <ErrorForm>{errors.value && errors.value.message}</ErrorForm>

            <div style={{ marginTop: '30px' }}>
              <PassphraseInput
                type="password"
                placeholder="Ingresar clave"
                ref={register}
                name="passphrase"
              ></PassphraseInput>
              <PassphraseButton disabled={pending} type="submit">
                {pending ? <Spinner /> : 'TRANSFERIR'}
              </PassphraseButton>
              <ErrorForm>
                {errors.passphrase && errors.passphrase.message}
              </ErrorForm>
            </div>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}

function TransactionSuccess(props: any) {
  return (
    <FormWrap>
      <Form>
        <p>La transferencia fue realizada con exito</p>
        <ul>
          <li>
            Transaction Hash: <RSKLink hash={props.value} type="tx" testnet />
          </li>
        </ul>
        <Button as={Link} to="/">
          CONTINUAR
        </Button>
      </Form>
    </FormWrap>
  );
}
