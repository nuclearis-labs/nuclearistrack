import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Button
} from '../components/components.js';
import { UserContext } from '../context/userContext';
import Spinner from 'react-bootstrap/Spinner';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer.js';
import { useForm } from 'react-hook-form';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { register, handleSubmit, errors } = useForm();

  let { from } = location.state || { from: { pathname: '/' } };

  function onSubmit(form) {
    setLoading(true);
    loginUser(form).then(() => history.replace(from));
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
            error={errors.email}
            autoComplete="username"
            ref={register({ required: true })}
          ></Input>
          <ErrorLabel>{errors.email && 'Este campo es obligatorio'}</ErrorLabel>
          <Label>CLAVE</Label>
          <Input
            name="passphrase"
            error={errors.passphrase}
            autoComplete="current-password"
            type="password"
            ref={register({ required: true })}
          />
          <ErrorLabel>
            {errors.passphrase && 'Este campo es obligatorio'}
          </ErrorLabel>
          <Button className="submit" onClick={handleSubmit(onSubmit)}>
            {loading ? (
              <>
                <Spinner animation="border" role="status" size="sm"></Spinner>{' '}
                LOADING
              </>
            ) : (
              'LOGIN'
            )}
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
};
