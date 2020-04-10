import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { Title, Label, ErrorLabel, Input, Button } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';

export default function Login() {
  const { login } = useAuth();

  const history = useHistory();
  const location = useLocation();
  const { register, handleSubmit, errors, getValues } = useForm();
  const { execute, pending } = useAsync(onSubmit, false);
  let from = location.state || { pathname: '/' };

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      login(form)
        .then(() => {
          history.replace(from);
          resolve();
        })
        .catch((e: Error) => reject(e.message));
    });
  }

  return (
    <>
      <Top>
        <Title>LOGIN</Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>USUARIO</Label>
          <Input
            name="email"
            disabled={pending}
            error={errors.email}
            autoComplete="username"
            ref={register({ required: true })}
          ></Input>
          <ErrorLabel>{errors.email && 'Este campo es obligatorio'}</ErrorLabel>
          <Label>CLAVE</Label>
          <Input
            name="passphrase"
            disabled={pending}
            error={errors.passphrase}
            autoComplete="current-password"
            type="password"
            ref={register({ required: true })}
          />
          <ErrorLabel>
            {errors.passphrase && 'Este campo es obligatorio'}
          </ErrorLabel>
          <Button
            className="submit"
            disabled={pending}
            onClick={handleSubmit(execute)}
          >
            {!pending ? 'LOGIN' : 'LOGIN IN...'}
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
