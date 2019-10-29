import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import ConfirmTx from '../components/ConfirmTx';
import { UserContext } from '../context/UserContext';

function TransferView() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState();
  const [users, setUsers] = useState();
  const [response, setResponse] = useState();
  const [status, setStatus] = useState('form');

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.post('/api/user/getAll').then(({ data }) => {
      setUsers(data);
    });
  }, []);

  function handleSubmit(e) {
    setStatus('sending');
    e.preventDefault();
    axios
      .post(`/api/transfer/to/${form.address}/${form.value}`, {
        email: contextUser.userEmail,
        passphrase: form.passphrase
      })
      .then(({ data }) => {
        setResponse(data);
        setStatus('success');
      })
      .catch(e => {
        setForm();
        setStatus('error');
      });
  }

  function ErrorTx() {
    return (
      <div class="alert alert-danger" role="alert">
        Transaction was not successful, please check your passphrase and amount
        to be transferred
      </div>
    );
  }

  function SuccessfulTx({ tx }) {
    return (
      <>
        <h3 className="text-center">Transaction successful</h3>
        <p className="text-center">
          <a href={`https://explorer.testnet.rsk.co/tx/${tx}`}>
            See transaction
          </a>
        </p>
      </>
    );
  }

  switch (status) {
    case 'form':
      return (
        <div className="container">
          <h1>Transfer RBTC</h1>
          <form>
            <div className="form-group">
              <label htmlFor="value">Amount to send</label>
              <input
                className="form-control"
                onChange={handleInput}
                type="number"
                name="value"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address to send to</label>
              <select
                className="form-control"
                onChange={handleInput}
                name="address"
                id="address"
              >
                <option>Choose one...</option>
                {users &&
                  users.length > 0 &&
                  users.map(user => (
                    <option key={user[1]} value={user[1]}>
                      {user[0] + ' / ' + user[1]}
                    </option>
                  ))}
              </select>
            </div>
            <hr />
            <ConfirmTx
              contextUser={contextUser}
              type="Transfer"
              handleSubmit={handleSubmit}
              handleInput={handleInput}
            />
          </form>
        </div>
      );
    case 'sending':
      return (
        <div className="container">
          <Loader />
        </div>
      );
    case 'success':
      return (
        <div className="container">
          <h1>Transfer RBTC</h1>
          <SuccessfulTx tx={response} />
        </div>
      );
    case 'error':
      return (
        <div className="container">
          <h1>Transfer RBTC</h1>
          <ErrorTx />
        </div>
      );
  }
}

export default TransferView;
