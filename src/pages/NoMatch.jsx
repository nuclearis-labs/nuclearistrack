import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';

export default function NoMatch() {
  return (
    <>
      <Top>
        <Title>PAGINA NO ENCONTRADA</Title>
      </Top>
      <FormWrap>
        <Form>
          <p>No se encontró la pagina solicitada, algúnas recomendaciones</p>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </Form>
      </FormWrap>
    </>
  );
}
