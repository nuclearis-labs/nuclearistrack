import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

function AddProjectForm() {
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [users, setUsers] = useState();
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

  useEffect(() => {
    axios.post('/api/user/getAll').then(({ data }) => {
      setUsers(data);
    });
  }, []);

  function handleSubmit(e) {
    setSending(true);
    e.preventDefault();
    axios
      .post('/api/project/', {
        ...form,
        email: 'info@nuclearis.com',
        passphrase: 'Nuclearis'
      })
      .then(result => {
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
      <h1>Add Project</h1>
      {isSending ? (
        <Loader />
      ) : event ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>Project successfully saved on the Blockchain!</h2>
          {<div>Transaction Hash: {event.transactionHash}</div>}
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
            <label htmlFor="expediente">Expediente</label>
            <input
              onChange={handleInput}
              type="number"
              name="expediente"
              className="form-control"
              id="expediente"
              placeholder="Enter Expediente"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Purchase Order</label>
            <input
              onChange={handleInput}
              type="text"
              name="oc"
              className="form-control"
              id="oc"
              placeholder="Enter Purchase Order"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Title</label>
            <input
              onChange={handleInput}
              type="text"
              name="proyectoTitle"
              className="form-control"
              id="title"
              placeholder="Enter Title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="">Client Address</label>
            <select
              onChange={handleInput}
              name="clientAddress"
              className="form-control"
              id="client"
              placeholder="Enter Client Address"
            >
              {users &&
                users.map(user => <option value={user[1]}>{user[0]}</option>)}
            </select>
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

export default AddProjectForm;
