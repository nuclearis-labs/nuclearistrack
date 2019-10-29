import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

function AddUser() {
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
        email: 'info@nuclearis.com',
        passphrase: 'Nuclearis'
      })
      .then(result => {
        console.log(result);

        setSending(false);
        if (result.data.error) {
          setError(result.data.error);
        } else {
          setEvent(result.data);
        }
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
          <div>Email: {event.result.email}</div>
          <div>Generated Address: {event.result.address}</div>
          <div>Encrypted Private Key: {event.result.encryptedPrivateKey}</div>
          <div>Transaction Hash: {event.txResult}</div>
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
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Create User
          </button>
        </form>
      )}
    </div>
  );
}

export default AddUser;
