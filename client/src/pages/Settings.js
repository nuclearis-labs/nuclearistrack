import React from 'react';
import Header from '../components/header';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer';

export default function Settings() {
  return (
    <>
      <Header />
      <Wrap>
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
      </Wrap>
      <Footer />
    </>
  );
}
