import React, { useEffect, useState } from 'react';
import RSKLink from '../components/RSKLink';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import Footer from '../components/Footer';
import useWeb3 from '../hooks/useWeb3';
import LoggedHeader from '../components/LoggedHeader';

export default function UserList() {
  const [web3, contract] = useWeb3();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUserList() {
      const msgSender = await web3.eth.getCoinbase();
      const addresses = await contract.methods
        .getAllUsers()
        .call({ from: msgSender });

      Promise.all(
        addresses.map((address) =>
          contract.methods.getUser(address).call({ from: msgSender })
        )
      ).then((users) => {
        setUsers(users);
      });
    }
    if (web3 && contract) getUserList().catch(console.error);
  }, [web3, contract]);

  useEffect(() => {
    async function getUserBalances() {
      const usersArr = await Promise.all(
        users.map(async (user) => {
          const bal = await web3.eth.getBalance(user[3]);
          return {
            ...user,
            '4': parseFloat(web3.utils.fromWei(bal)).toFixed(6),
          };
        })
      );
      setUsers(usersArr);
    }
    if (web3 && users.length > 0 && !users[0].hasOwnProperty('4'))
      getUserBalances();
  }, [users, web3]);

  if (web3)
    return (
      <>
        <LoggedHeader />
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
              <Col4>BALANCE</Col4>
            </HeadRow>
            {users.length === 0 ? (
              <Row>
                <Col4 style={{ textAlign: 'center', width: '100%' }}>
                  No hay usuarios cargados para usted
                </Col4>
              </Row>
            ) : (
              users.map((user) => (
                <Row key={user[3]}>
                  <Col4>{web3.utils.hexToAscii(user[2])}</Col4>
                  <Col4>
                    <RSKLink type="address" testnet hash={user[3]} />
                  </Col4>
                  <Col4>
                    {user[1] === '0'
                      ? 'Administrador'
                      : user[1] === '1'
                      ? 'Cliente'
                      : 'Proveedor'}
                  </Col4>
                  <Col4>{user[0] === '1' ? 'Activo' : 'Pausado'}</Col4>
                  <Col4>{user[4]} RBTC</Col4>
                </Row>
              ))
            )}
          </Form>
        </FormWrap>
        <Footer />
      </>
    );
  else return null;
}
