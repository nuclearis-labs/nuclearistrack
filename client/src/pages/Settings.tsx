import React from 'react';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';

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
