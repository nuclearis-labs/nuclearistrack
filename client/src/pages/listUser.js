import React, { useState, useEffect } from 'react';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import axios from 'axios';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export const ListUser = () => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/user/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setUser(data);
      console.log(data);
    });
  }, []);

  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>Listado de usuarios</Title>
        </Top>
        <FormWrap>
          <Form>
            <table cellPadding={10}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {user.map(({ name, type, address, status }) => (
                  <tr>
                    <td>{name}</td>
                    <td>{type == 0 ? 'Cliente' : 'Proveedor'}</td>
                    <td>{address}</td>
                    <td>
                      {status == 0
                        ? 'En creación'
                        : status == 1
                        ? 'Activado'
                        : 'Pausado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
};
