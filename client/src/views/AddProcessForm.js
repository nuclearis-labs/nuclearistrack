import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function AddProcessForm() {
  let { contract } = useParams();

  const [contractState, setContract] = useState();
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.post('/api/project/get/' + contract).then(({ data }) => {
      setContract(data);
      setLoading(false);
    });
  }, []);

  function resetState() {
    setEvent();
    setForm([]);
    setError(false);
    setSending(false);
  }

  function handleSubmit(e) {
    setSending(true);
    e.preventDefault();
    console.log(contract);

    axios
      .post('/api/process/create/' + contract, {
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
          setEvent(result.data.response);
        }
      });
  }

  return (
    <div className="container">
      <h1>Add Process {contractState && 'to ' + contractState[0]}</h1>
      {isSending ? (
        <div className="d-flex justify-content-center mt-5">
          <div
            className="spinner-border"
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : event ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>Project successfully saved on the Blockchain!</h2>
          {/*    <div>Project Contract Address: {event.returnValues[0]}</div>
          <div>Transaction Hash: {event.transactionHash}</div> */}
          <button className="btn btn-primary" onClick={resetState}>
            Create another project
          </button>
          <Link to="project-list" className="btn btn-primary">
            Go to Project List
          </Link>
        </div>
      ) : error ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>Error saving project to Blockchain</h2>
          <div>
            {error !== 'Error: Returned error: execution error: revert' &&
              error}
          </div>
          <button className="btn btn-primary" onClick={resetState}>
            Create another project
          </button>
          <Link to="project-list" className="btn btn-primary">
            Go to Project List
          </Link>
        </div>
      ) : (
        <form>
          <div className="form-group">
            <label htmlFor="processTitle">Title</label>
            <input
              onChange={handleInput}
              type="text"
              name="processTitle"
              className="form-control"
              id="processTitle"
              placeholder="Enter Title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="supplierAddress">Supplier Address</label>
            <input
              onChange={handleInput}
              type="text"
              name="supplierAddress"
              className="form-control"
              id="supplierAddress"
              placeholder="Enter Supplier Address"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Create Project
          </button>
        </form>
      )}
    </div>
  );
}

export default AddProcessForm;
