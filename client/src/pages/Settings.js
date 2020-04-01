import React from 'react';
import { Title } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer';

export default function Settings() {
  return (
    <>
      <Top>
        <Title>PREFERENCIAS</Title>
      </Top>
      <FormWrap>
        <Form>
          <ul style={{ padding: '10px' }}>
            <li>CAMBIO DE CONTRASEÑA</li>
            <li>CAMBIO DE CORREO ELECTRONICO</li>
          </ul>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
