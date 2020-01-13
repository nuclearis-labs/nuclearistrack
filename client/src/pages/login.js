import React, { useState, useContext } from 'react';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { UserContext } from '../context/userContext';

import { Top, Form, FormWrap } from '../components/form.js';

export const Login = () => {
  const [form, setForm] = useState([]);
  const { contextUser, loginUser } = useContext(UserContext);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  return (
    <Wrap>
      <Top>
        <Title>LOGIN</Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>USUARIO</Label>
          <Input name="email" onChange={handleInput}></Input>
          <Label>CLAVE</Label>
          <Input
            name="passphrase"
            type="password"
            onChange={handleInput}
          ></Input>
          <Button
            className="submit"
            onClick={() => {
              loginUser(form);
            }}
          >
            INGRESAR
          </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
};
