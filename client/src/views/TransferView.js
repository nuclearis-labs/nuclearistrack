import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

function TransferView() {
  const [form, setForm] = useState();
  const [isSending, setSending] = useState(false);
  const [isResponse, setResponse] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    setSending(true);
    e.preventDefault();
    axios
      .post(`/api/transfer/to/${form.address}/${form.value}`, {
        email: 'info@nuclearis.com',
        passphrase: 'Nuclearis'
      })
      .then(({ data }) => {
        console.log(data);

        setResponse(data);
      });
  }

  return (
    <div className="container">
      <h1>Transfer Ether</h1>
      {isResponse ? (
        <>
          <h3 className="text-center">Transaction successful</h3>
          <p className="text-center">{isResponse}</p>
        </>
      ) : isSending ? (
        <Loader />
      ) : (
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
            <label htmlFor="value">Address to send to</label>
            <input
              className="form-control"
              onChange={handleInput}
              type="text"
              name="address"
            />
          </div>
          <button onClick={handleSubmit} className="btn btn-primary">
            Sign & Send
          </button>
        </form>
      )}
    </div>
  );
}

export default TransferView;
