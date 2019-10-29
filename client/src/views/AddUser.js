import React, { useState, useContext } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';
import ConfirmTx from '../components/ConfirmTx';

function AddUser() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function resetState() {
    setEvent();
    setForm([]);
    setError(false);
    setSending(false);
  }

  function handleSubmit(e) {
    setSending(true);
    e.preventDefault();
    axios
      .post('/api/user/', {
        ...form,
        email: contextUser.userEmail,
        passphrase: form.passphrase
      })
      .then(result => {
        setSending(false);
        if (result.data.error) {
          setError(result.data.error);
        } else {
          setEvent(result.data);
        }
      })
      .catch(e => {
        setEvent();
        setSending(false);
        setError('Not able to save User to the Blockchain, try later again');
      });
  }

  return (
    <div className="container">
      <h1>Add User</h1>
      {isSending ? (
        <Loader />
      ) : event ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>User successfully saved on the Blockchain!</h2>
          <div>Username: {event.username}</div>
          <div>Email: {event.email}</div>
          <div>Generated Address: {event.address}</div>
          <div>Transaction Hash: {event.txHash}</div>
          <button className="btn btn-primary" onClick={resetState}>
            Create another user
          </button>
        </div>
      ) : error ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>Error saving user to Blockchain</h2>
          <div>
            {error !== 'Error: Returned error: execution error: revert' &&
              error}
          </div>
          <button className="btn btn-primary" onClick={resetState}>
            Try again
          </button>
        </div>
      ) : (
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              onChange={handleInput}
              type="text"
              name="newUserName"
              className="form-control"
              id="name"
              autoComplete="username"
              placeholder="Enter Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleInput}
              type="email"
              name="newUserEmail"
              autoComplete="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleInput}
              type="password"
              autoComplete="current-password"
              name="newPassphrase"
              className="form-control"
              id="password"
              placeholder="Enter Password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Type</label>
            <select
              className="form-control"
              value={form.userType ? form.userType : 'Choose...'}
              name="userType"
              onChange={handleInput}
              id="type"
            >
              <option>Choose...</option>
              <option value={0}>Client</option>
              <option value={1}>Supplier</option>
            </select>
          </div>
          <hr />
          <ConfirmTx
            contextUser={contextUser}
            type="User"
            handleSubmit={handleSubmit}
            handleInput={handleInput}
          />
        </form>
      )}
    </div>
  );
}

export default AddUser;
