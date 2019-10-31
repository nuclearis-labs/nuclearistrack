import React from 'react';

function ConfirmTx({ contextUser, type, handleSubmit, handleInput }) {
  return (
    <div className="form-inline">
      <div className="form-group mb-2">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="text"
          className="form-control-plaintext"
          id="email"
          autoComplete="username"
          value={contextUser.userEmail || ''}
          readOnly
        />
      </div>
      <div className="form-group mx-sm-3 mb-2">
        <label htmlFor="passphrase" className="sr-only">
          Passphrase
        </label>
        <input
          id="passphrase"
          className="form-control"
          onChange={handleInput}
          type="password"
          autoComplete="current-password"
          name="passphrase"
          required={true}
          placeholder="Confirm passphrase"
        />
      </div>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
        Confirm identify and create {type}
      </button>
    </div>
  );
}
export default ConfirmTx;
