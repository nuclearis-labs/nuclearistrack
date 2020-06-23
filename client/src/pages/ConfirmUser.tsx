// newProvider.js
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Title, Label, Input, Button } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import Footer from '../components/Footer';
import { useHistory } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import { ConfirmSchema } from '../validationSchemas/index';

export default function ConfirmUser() {
  const { id } = useParams();
  const { register, handleSubmit, errors, setError, getValues } = useForm({
    validationSchema: ConfirmSchema
  });
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  let history = useHistory();

  function onSubmit(evt: any) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `/api/user/confirm/${id}`,
        data: getValues(),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.response.data));
    });
  }

  return (
    <>
      <Top>
        <Title>
          CONFIRM
          <br />
          USER
        </Title>
      </Top>
      {value ? (
        <Confirmation {...value} />
      ) : (
        <FormWrap>
          <Form onSubmit={handleSubmit(execute)}>
            <Label>PASSPHRASE</Label>
            <Input
              type="password"
              ref={register({ required: 'Se requiere elegir una contraseña' })}
              name="passphrase"
            />
            <ErrorForm>
              {errors.passphrase && errors.passphrase.message}
            </ErrorForm>
            <Label>CONFIRM PASSPHRASE</Label>
            <Input
              type="password"
              ref={register({ required: 'Se requiere elegir una contraseña' })}
              name="confirm_passphrase"
            />
            <ErrorForm>
              {errors.confirm_passphrase && errors.confirm_passphrase.message}
            </ErrorForm>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner size="sm" color="white" /> : 'CONFIRMAR'}
            </Button>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}

function Confirmation(props: any) {
  return (
    <FormWrap>
      <Form>
        <p>Su cuenta fue creada con exito!</p>
        <ul>
          <li>Nombre: {props.username}</li>
          <li>Correo electronico: {props.email}</li>
          <li>Clave Mnemonica: {props.mnemonic}</li>
          <li>Dirección: {props.address}</li>
          <li>
            Transaction: <RSKLink hash={props.txHash} type="tx" testnet />
          </li>
        </ul>
        <p>
          Les sugerimos de anotar en un medio seguro la clave mnemonica, ya que
          es la unica forma de recuperar su cuenta en caso de que se olvide la
          clave ingresada.
        </p>
        <Button as={Link} to="/">
          CONTINUAR
        </Button>
      </Form>
    </FormWrap>
  );
}
