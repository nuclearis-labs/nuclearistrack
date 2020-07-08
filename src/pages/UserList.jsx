import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import RSKLink from '../components/RSKLink';
import { Title, ScrollBox400 } from '../styles/components';
import { Top } from '../styles/form';
import { Table, Row, HeadRowMonsterrat, Col } from '../styles/tableComponents';
import TxTrack from '../components/TxTrack';
import { UserContext } from '../context/UserContext';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [txHash, setTxHash] = useState(undefined);
  const { account, web3, contract } = useContext(UserContext);

  useEffect(() => {
    async function getUserList() {
      const addresses = await contract.methods
        .getAllUsers()
        .call({ from: account.address });
      Promise.all(
        addresses.map((address) =>
          contract.methods.getUser(address).call({ from: account.address })
        )
      ).then((users) => {
        Promise.all(
          users.map(async (user) => {
            return {
              ...user,
              '4': parseFloat(
                web3.utils.fromWei(await web3.eth.getBalance(user[3]))
              ).toFixed(6),
            };
          })
        ).then((users) => setUsers(users));
      });
    }
    getUserList().catch(console.error);
    // eslint-disable-next-line
  }, []);

  function toggleUser(address) {
    contract.methods
      .toggleUserStatus(address)
      .send({ from: account.address })
      .on('transactionHash', (txHash) => setTxHash(txHash));
  }

  return (
    <>
      <Top>
        <Title>USUARIOS</Title>
      </Top>
      <TableWrap>
        <Table>
          {txHash ? (
            <TxTrack tx={txHash} />
          ) : (
            <>
              <HeadRowMonsterrat>
                <Col>NOMBRE</Col>
                <Col>DIRECCION</Col>
                <Col>TIPO</Col>
                <Col>ESTADO</Col>
                <Col>BALANCE</Col>
              </HeadRowMonsterrat>
              <ScrollBox400>
                {users.length === 0 ? (
                  <Row>
                    <Col style={{ textAlign: 'center', width: '100%' }}>
                      No hay usuarios cargados para usted
                    </Col>
                  </Row>
                ) : (
                  users.map((user) => (
                    <Row key={user[3]}>
                      <Col>{web3.utils.hexToAscii(user[2])}</Col>
                      <Col>
                        <RSKLink type="address" testnet hash={user[3]} />
                      </Col>
                      <Col>
                        {user[1] === '0'
                          ? 'Administrador'
                          : user[1] === '1'
                          ? 'Cliente'
                          : 'Proveedor'}
                      </Col>
                      <Col>
                        <TableButton onClick={() => toggleUser(user[3])}>
                          {user[0] === '1' ? 'ACTIVO' : 'PAUSADO'}
                        </TableButton>
                      </Col>
                      <Col>{user[4]} RBTC</Col>
                    </Row>
                  ))
                )}
              </ScrollBox400>
            </>
          )}
        </Table>
      </TableWrap>
    </>
  );
}

const TableButton = styled.button`
  font-size: '12px';
  font-family: 'Roboto condensed';
  margin: 0;
  background-color: #8c6239;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  border: none;
  height: 30px;
  padding: 5px 10px;
`;

const TableWrap = styled.div`
  background-color: #e6e6e6;
  width: 100%;
`;
