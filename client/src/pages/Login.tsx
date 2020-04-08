import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { Title, Label, ErrorLabel, Input, Button } from '../styles/components';
import Spinner from 'react-bootstrap/Spinner';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';

export const Login = () => {
  const { login } = useAuth();

  const history = useHistory();
  const location = useLocation();
  const { register, handleSubmit, errors } = useForm();
  const { execute, pending, value, error } = useAsync(
    handleSubmit(onSubmit),
    false
  );
  let { from } = location.state || { from: { pathname: '/' } };

  function onSubmit(form) {
    return new Promise((resolve, reject) => {
      login(form)
        .then(() => {
          history.replace(from);
          resolve();
        })
        .catch(e => reject(e));
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
          <Button className="submit" disabled={pending} onClick={execute}>
            {!pending ? 'LOGIN' : 'LOGIN IN...'}
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
};
