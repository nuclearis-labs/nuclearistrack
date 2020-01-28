import React from 'react';
import Header from '../components/header';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer';

export default function Contact() {
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>Contacto</Title>
        </Top>
        <FormWrap>
          <Form>
            <p>Rellene el siguiente formulario</p>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
