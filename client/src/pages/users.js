import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Title, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { Row, HeadRow, Col4 } from '../components/tableComponents.js';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/user/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setUsers(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>USUARIOS</Title>
        </Top>
        <FormWrap>
          <Form>
            <HeadRow>
              <Col4>NOMBRE</Col4>
              <Col4>TIPO</Col4>
              <Col4>DIRECCION</Col4>
              <Col4>ESTADO</Col4>
            </HeadRow>

            {users.map(user => (
              <Row key={user.address}>
                <Col4>{user.name}</Col4>
                <Col4>{user.type === '0' ? 'Cliente' : 'Proveedor'}</Col4>
                <Col4>{user.address}</Col4>
                <Col4>{user.status === '1' ? 'Activo' : 'Pausado'}</Col4>
              </Row>
            ))}

            <Button as={Link} className="submit" to="/users/add">
              NUEVO USUARIO
            </Button>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
