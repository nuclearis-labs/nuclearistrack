// newProvider.js
import React from 'react';
import styled from 'styled-components';
import { Title, Label, Input, Button, Wrap } from '../components/components.js';
import { Explain } from '../components/webComponents.js';
import { Top, Form, FormWrap } from '../components/form.js';

const FormWrapWhite = styled(FormWrap)`
  background:#fafafa;
`;

const ButtonLogin = styled(Button)`
  font-size:18px;
  font-family: 'Roboto Condensed',sans-serif;
  margin:30px 0;
  letter-spacing:3px;
`;

const PasswordLink = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-size:13px;
  color:#5d5d5d;
  text-decoration:none;
  font-weight:700;
  letter-spacing:2px;
  cursor:pointer;
  &:hover{color:#8c6239;}
`;

function Login() {
  return (
    <Wrap>
      <FormWrapWhite>
        <Form>
          <Title>
            LOGIN
          </Title>
          <Explain>
            ESTE ES UN ACCESO EXCLUSIVO PARA CLIENTES Y PROVEEDORES
          </Explain>
          <Label>
            USUARIO
          </Label>
          <Input>
          </Input>
          <Label>
            CLAVE
          </Label>
          <Input>
          </Input>
          <ButtonLogin>
            INGRESAR
          </ButtonLogin>
          <Explain>
            SI NO RECECUERDA O EXTRAVIO LA CLAVE
          </Explain>
          <PasswordLink>
            SOLICITAR NUEVA CLAVE
          </PasswordLink>
        </Form>
      </FormWrapWhite>
    </Wrap>
  );
}
export default Login;