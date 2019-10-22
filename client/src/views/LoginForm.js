import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [form, setForm] = useState({});
  const [error, setError] = useState();
  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post('/auth', form)
      .then(result => {
        console.log(result);
        if (result.status === 200) {
          localStorage.setItem('token', JSON.stringify(result.data.token));
        } else {
          setError('Usuario o contraseña erronea');
        }
      })
      .catch(e => {
        setError('Problema con login');
      });
  }
  return (
    <div className="container">
      <h1>Login</h1>
      {error && (
        <div class="alert alert-warning" role="alert">
          {error}
        </div>
      )}
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            className="form-control"
            type="email"
            onChange={handleInput}
            name="email"
            id="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            onChange={handleInput}
            name="passphrase"
            id="password"
          />
        </div>
        <button onClick={handleSubmit}>Acceder</button>
      </form>
    </div>
  );
}
export default LoginForm;
