import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';

function UserTableBody({ users }) {
  return (
    <>
      {users &&
        users.map(([nombre, direccion, balance]) => {
          return (
            <tr key={direccion}>
              <td>
                <Link to={'/client-detail/' + direccion}>{nombre}</Link>
              </td>
              <td>
                <a
                  href={`https://explorer.testnet.rsk.co/address/${direccion}`}
                >
                  {direccion}
                </a>
              </td>
              <td>{balance}</td>
            </tr>
          );
        })}
    </>
  );
}

function UserList() {
  const [users, setUsers] = useState({});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .post('/api/user/getAll')
      .then(({ data }) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div className="container-fluid">
      <h1>Lista de Usuarios</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          body={<UserTableBody users={users} />}
          columns={['Nombre', 'Dirección', 'Balance (RBTC)']}
          options={{ currentPage: 1 }}
        ></Table>
      )}
    </div>
  );
}

export default UserList;
