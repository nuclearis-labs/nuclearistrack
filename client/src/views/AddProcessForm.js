import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';
import ConfirmTx from '../components/ConfirmTx';
import RSKLink from '../components/RSKLink';

function AddProcessForm() {
  let { contract } = useParams();
  const { contextUser } = useContext(UserContext);
  const [contractState, setContract] = useState();
  const [users, setUsers] = useState();
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
    axios.post(`/api/project/getAll`).then(({ data }) => {
      setContract(data);
      axios.post('/api/user/getAll').then(({ data }) => {
        const suppliers = data.filter(user => user[2] === '1');
        setUsers(suppliers);
        setLoading(false);
      });
    });
  }, [contract, setLoading]);

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
      .post('/api/process/create/' + form.contract, {
        ...form,
        email: contextUser.userEmail
      })
      .then(({ data }) => {
        console.log(data);
        setSending(false);
        setEvent(data);
      })
      .catch(e => {
        setError();
      });
  }

  return (
    <div className="container">
      <h1>Add Process</h1>
      {isSending ? (
        <Loader />
      ) : event ? (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>Project successfully saved on the Blockchain!</h2>
          <div>
            Transaction Hash:{' '}
            <RSKLink hash={event} type="tx" testnet={true} text={event} />
          </div>
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

            <select
              className="form-control"
              onChange={handleInput}
              name="supplierAddress"
              id="supplierAddress"
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
          <div className="form-group">
            <label htmlFor="project">Project</label>
            <select
              className="form-control"
              onChange={handleInput}
              name="contract"
            >
              <option>Choose one...</option>
              {contractState &&
                contractState.length > 0 &&
                contractState.map(project => (
                  <option key={project[4]} value={project[4]}>
                    {project[0] + ' / ' + project[4]}
                  </option>
                ))}
            </select>
          </div>
          <hr />
          <ConfirmTx
            contextUser={contextUser}
            type="Process"
            handleSubmit={handleSubmit}
            handleInput={handleInput}
          />
        </form>
      )}
    </div>
  );
}

export default AddProcessForm;
