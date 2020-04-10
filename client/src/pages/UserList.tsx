import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import { Title, Button } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import Footer from '../components/Footer';
import useSWR from 'swr';

export default function UserList() {
  const { data } = useSWR('/api/user/get', url =>
    axios({
      method: 'get',
      url: '/api/user/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => data)
  );

  return (
    <>
      <Top>
        <Title>USUARIOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col4>NOMBRE</Col4>
            <Col4>MAIL</Col4>
            <Col4>DIRECCION</Col4>
          </HeadRow>

          {data?.map(
            (
              user: { username: string; email: string; address: string },
              i: number
            ) => (
              <Row key={i}>
                <Col4>{user.username}</Col4>
                <Col4>{user.email}</Col4>
                <Col4>
                  {user.address && (
                    <RSKLink hash={user.address} type="address" testnet />
                  )}
                </Col4>
              </Row>
            )
          )}

          <Button as={Link} className="submit" to="/users/add">
            NUEVO USUARIO
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
