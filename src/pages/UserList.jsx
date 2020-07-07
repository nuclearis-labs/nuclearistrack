import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RSKLink from '../components/RSKLink';
import { Title, ScrollBox400 } from '../styles/components';
import { Top } from '../styles/form';
import { Table, Row, HeadRowMonsterrat, Col } from '../styles/tableComponents';
import Footer from '../components/Footer';
import useWeb3 from '../hooks/useWeb3';
import LoggedHeader from '../components/LoggedHeader';
import TxTrack from '../components/TxTrack';

export default function UserList() {
  const [web3, contract] = useWeb3();
  const [users, setUsers] = useState([]);
  const [txHash, setTxHash] = useState(undefined);

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

  function toggleUser(address) {
    web3.eth.getCoinbase().then((msgSender) =>
      contract.methods
        .toggleUserStatus(address)
        .send({ from: msgSender })
        .on('transactionHash', (txHash) => setTxHash(txHash))
    );
  }

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

        <Footer />
      </>
    );
  else return null;
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
