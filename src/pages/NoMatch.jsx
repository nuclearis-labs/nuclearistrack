import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import PublicHeader from '../components/PublicHeader';
export default function NoMatch() {
  return (
    <>
      <PublicHeader />
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
      <Footer />
    </>
  );
}
