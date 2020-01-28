import React from 'react';
import Header from '../components/header';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer';

export default function Home() {
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>Bienvenido</Title>
        </Top>
        <FormWrap>
          <Form>
            <p>
              Esta todo muy en construcción, pero ya existen las siguientes
              funcionalidades:
            </p>
            <ul>
              <li>Crear proyectos nuevos</li>
              <li>Crear usuarios nuevos</li>
              <li>Crear procesos nuevos</li>
            </ul>
            <ul>
              <li>El usuario puede confirmar su usuario</li>
            </ul>
            <ul>
              <li>Listar todos los proyectos</li>
              <li>Listar todos los procesos</li>
              <li>Listar todos los usuarios</li>
            </ul>
            <ul>
              <li>Ingresar como usuario info@nuclearis.com / Nuclearis</li>
              <li>Cerrar session</li>
            </ul>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
