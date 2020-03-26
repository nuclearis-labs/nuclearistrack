import React, { useState, useContext } from 'react';
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import { Title, Label, Input, Button, Wrap } from '../components/components.js';
import { UserContext } from '../context/userContext';
import Spinner from 'react-bootstrap/Spinner';

import { Top, Form, FormWrap } from '../components/form.js';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export const Login = () => {
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();

  let { from } = location.state || { from: { pathname: '/' } };

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleLogin() {
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
          <Button className="submit" onClick={handleLogin}>
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
