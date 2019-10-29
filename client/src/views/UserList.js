import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import CogIcon from '../components/CogIcon';
import CheckIcon from '../components/CheckIcon';

function UserTableBody({ users }) {
  if (users.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          No users available
        </td>
      </tr>
    );
  }
  return (
    <>
      {users &&
        users.map(([nombre, direccion, type, balance, status]) => {
          return (
            <tr key={direccion}>
              <td>
                {status === 'pending' ? (
                  <>{nombre}</>
                ) : (
                  <Link to={'/client-detail/' + direccion}>{nombre}</Link>
                )}
              </td>
              <td>
                {status === 'pending' ? (
                  <a href={`https://explorer.testnet.rsk.co/tx/${direccion}`}>
                    Pendiente: Ver estado de transacción
                  </a>
                ) : (
                  <a
                    href={`https://explorer.testnet.rsk.co/address/${direccion}`}
                  >
                    {direccion}
                  </a>
                )}
              </td>
              <td>{type === '0' ? 'Client' : 'Supplier'}</td>
              <td>{balance || 0}</td>
              <td>{status === 'pending' ? <CogIcon /> : <CheckIcon />}</td>
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
        console.log(data);

        setUsers(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div className="container">
      <h1>User List</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          body={<UserTableBody users={users} />}
          columns={['Nombre', 'Address', 'Type', 'Balance (RBTC)', 'Status']}
          options={{ currentPage: 1 }}
        ></Table>
      )}
    </div>
  );
}

export default UserList;
