import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import RSKLink from '../components/RSKLink';

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
        users.map(({ address, balance, type, username, status }) => {
          return (
            <tr key={address}>
              <td>
                {status === 'pending' ? (
                  <>{username}</>
                ) : (
                  <Link to={'/client-detail/' + address}>{username}</Link>
                )}
              </td>
              <td>
                {status === 'pending' ? (
                  <RSKLink
                    hash={address}
                    type="tx"
                    testnet={true}
                    text={address}
                  />
                ) : (
                  <RSKLink
                    hash={address}
                    type="address"
                    testnet={true}
                    text={address}
                  />
                )}
              </td>
              <td>{type === '0' ? 'Client' : 'Supplier'}</td>
              <td>{balance || 0}</td>
              {/* <td>{status === 'pending' ? <CogIcon /> : <CheckIcon />}</td> */}
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
      .get('/api/user/get')
      .then(({ data }) => {
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
