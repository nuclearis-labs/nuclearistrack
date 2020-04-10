// newProvider.js
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Title, Label, Input, Button, ErrorLabel } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';

export default function ConfirmUser() {
  const { id } = useParams();
  const { execute, pending, value } = useAsync(onSubmit, false);
  const { register, handleSubmit, errors, getValues } = useForm();

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      axios({
        method: 'post',
        url: `/api/user/confirm/${id}`,
        data: {
          ...form
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(result => {
          if (result.data.error) {
            reject(result.data.error);
          } else {
            resolve(result.data);
          }
        })
        .catch(e => resolve(e.message));
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
        <FormWrap>
          <Form>
            <p>Su cuenta fue creada con exito!</p>
            <ul>
              <li>Nombre: {value?.username}</li>
              <li>Correo electronico: {value?.email}</li>
              <li>Clave Mnemonica: {value?.mnemonic}</li>
              <li>Dirección: {value?.address}</li>
              <li>
                Transaction:{' '}
                <RSKLink hash={value?.txHash} type="tx" testnet />
              </li>
            </ul>
            <p>
              Les sugerimos de anotar en un medio seguro la clave mnemonica, ya
              que es la unica forma de recuperar su cuenta en caso de que se
              olvide la clave ingresada.
            </p>
            <Button as={Link} to="/">
              CONTINUAR
            </Button>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form>
            <Label>PASSPHRASE</Label>
            <Input
              type="password"
              name="passphrase"
              error={errors.passphrase ? true : false}
              ref={register({ required: true })}
            />
            <ErrorLabel>
              {errors.passphrase && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>CONFIRM PASSPHRASE</Label>
            <Input
              type="password"
              name="confirm_passphrase"
              error={errors.confirm_passphrase}
              ref={register({ required: true })}
            />
            <ErrorLabel>
              {errors.confirm_passphrase && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Button
              className="submit"
              disabled={pending}
              onClick={handleSubmit(execute)}
            >
              {pending ? 'LOADING' : 'CREAR'}
            </Button>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
