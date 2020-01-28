import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header.js';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer.js';

export default function NoMatch() {
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>PAGINA NO ENCONTRADA</Title>
        </Top>
        <FormWrap>
          <Form>
            <p>No se encontró la pagina solicitada, algúnas recomendaciones</p>
            <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
