import React, { useEffect, useContext, useState } from 'react';
import RSKLink from '../components/RSKLink';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import Footer from '../components/Footer';
import { DrizzleContext } from '@drizzle/react-plugin';

export default function UserList() {
  const { drizzle, initialized } = useContext(DrizzleContext.Context);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (initialized)
      drizzle.contracts.NuclearPoE.methods
        .getAllUsers()
        .call()
        .then((addresses) => {
          const arr = addresses.map((address) =>
            drizzle.contracts.NuclearPoE.methods.getUser(address).call()
          );
          Promise.all(arr).then((users) => {
            setUsers(users);
          });
        })
        .catch((error) => console.error(error));
  }, [initialized]);

  return (
    <>
      <Top>
        <Title>USUARIOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col4>NOMBRE</Col4>
            <Col4>DIRECCION</Col4>
            <Col4>TIPO</Col4>
            <Col4>ESTADO</Col4>
          </HeadRow>
          {users.length > 0 &&
            users.map((user) => (
              <Row key={user[3]}>
                <Col4>{drizzle.web3.utils.hexToAscii(user[2])}</Col4>
                <Col4>
                  <RSKLink type="address" hash={user[3]} />
                </Col4>
                <Col4>
                  {user[1] == 0
                    ? 'Administrador'
                    : user[1] == 1
                    ? 'Cliente'
                    : 'Proveedor'}
                </Col4>
                <Col4>{user[0] == 1 ? 'Activo' : 'Pausado'}</Col4>
              </Row>
            ))}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
