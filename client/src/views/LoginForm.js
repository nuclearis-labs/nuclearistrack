import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function LoginForm() {
  const [form, setForm] = useState({});
  const [error, setError] = useState();
  const [loginIn, setLogin] = useState(false);
  const [formState, setFormState] = useState();
  const { contextUser, logoutUser, loginUser } = useContext(UserContext);
  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setLogin(true);
    loginUser(form)
      .then(() => {
        setError();
        setLogin(false);
      })
      .catch(e => {
        setLogin(false);
        setError('No se pudo...');
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
        <fieldset>
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
        </fieldset>
        {loginIn ? (
          <button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Loading...</span>
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Acceder
          </button>
        )}
      </form>
    </div>
  );
}
export default LoginForm;
