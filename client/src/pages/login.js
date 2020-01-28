import React, { useState, useContext } from 'react';
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import { Title, Label, Input, Button, Wrap } from '../components/components.js';
import { UserContext } from '../context/userContext';

import { Top, Form, FormWrap } from '../components/form.js';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export const Login = () => {
  const [form, setForm] = useState([]);
  const { loginUser } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();

  let { from } = location.state || { from: { pathname: '/' } };

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>LOGIN</Title>
        </Top>
        <FormWrap>
          <Form>
            <Label>USUARIO</Label>
            <Input
              name="email"
              autoComplete="username"
              onChange={handleInput}
            ></Input>
            <Label>CLAVE</Label>
            <Input
              name="passphrase"
              autoComplete="current-password"
              type="password"
              onChange={handleInput}
            ></Input>
            <Button
              className="submit"
              onClick={() => {
                loginUser(form)
                  .then(() => history.replace(from))
                  .catch(e => console.error(e));
              }}
            >
              INGRESAR
            </Button>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
};
