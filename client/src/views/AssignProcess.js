import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';
import ConfirmTx from '../components/ConfirmTx';
import RSKLink from '../components/RSKLink';

function AssignProcess() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [processes, setProcesses] = useState();
  const [projects, setProjects] = useState();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.get('/api/project/get').then(({ data }) => {
      setProjects(data);
      axios.get('/api/process/get').then(({ data }) => {
        setProcesses(data);
        setLoading(false);
      });
    });
  }, [setLoading]);

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
      .post('/api/project/assignProcess/', {
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
      <h1>Assign Process To Project</h1>
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
          <Link to="/" className="btn btn-primary">
            Continue
          </Link>
        </div>
      ) : (
        <form>
          <div className="form-group">
            <label htmlFor="expediente">Project</label>
            <select
              className="form-control"
              onChange={handleInput}
              name="expediente"
              id="expediente"
            >
              <option>Choose one...</option>
              {projects &&
                projects.length > 0 &&
                projects.map(project => (
                  <option key={project.expediente} value={project.expediente}>
                    {project.title + ' / ' + project.expediente}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="processContract">Process</label>
            <select
              className="form-control"
              onChange={handleInput}
              name="processContract"
              id="processContract"
            >
              <option>Choose one...</option>
              {processes &&
                processes.length > 0 &&
                processes.map(process => (
                  <option
                    key={process.contractAddress}
                    value={process.contractAddress}
                  >
                    {process.processName +
                      ' / ' +
                      process.supplierName +
                      ' / ' +
                      process.contractAddress}
                  </option>
                ))}
            </select>
          </div>
          <hr />
          <ConfirmTx
            contextUser={contextUser}
            type="Assign"
            handleSubmit={handleSubmit}
            handleInput={handleInput}
          />
        </form>
      )}
    </div>
  );
}

export default AssignProcess;
