import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NuclearPoE from './contracts/NuclearPoE';
import axios from 'axios';

function App() {
  const [block, setBlock] = useState({ number: 0 });
  const [error, setError] = useState(false);
  const [project, setProject] = useState([]);
  const [inProgress, setInProgress] = useState();
  const [form, setForm] = useState([]);
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
  );

  const contract = new web3.eth.Contract(
    NuclearPoE.abi,
    '0x955eB19F7741e102DBf61e4347079A8decF30fF7'
  );

  contract.events.allEvents().on('data', event => {
    if (event.event === 'CreateProject') {
      setInProgress(false);
      setBlock(event);
    }
  });

  useEffect(() => {
    setProject([]);
    contract.methods
      .projectCount()
      .call()
      .then(count => {
        for (let i = 0; i < count; i++) {
          contract.methods
            .projectContractsArray(i)
            .call()
            .then(indProject => {
              setProject(projects => [...projects, indProject]);
            });
        }
      });
  }, [inProgress]);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setInProgress(true);
    axios.post('/api/project', form).then(response => {
      if (response.data.error) {
        console.log(response.data.error);
        setInProgress(false);

        setError('Project not created');
      }
      console.log(response);
    });
  }

  return (
    <div className="container">
      <h1>Creación de nuevo proyecto</h1>
      {inProgress === false ? (
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">Project created!</h1>
            <div>Expediente number {form.expediente}</div>
            <div>Project Title {form.proyectoTitle}</div>
            <div>
              Blockchain Address{' '}
              {block.returnValues &&
                block.returnValues.newProjectContractAddress}
            </div>
            <div>Transaction Hash {block.transactionHash}</div>
          </div>
        </div>
      ) : inProgress === true ? (
        <div className="alert alert-primary">Creation in process</div>
      ) : error == 'Project not created' ? (
        <div className="alert alert-primary">Warning</div>
      ) : (
        <div></div>
      )}
      <form>
        <div className="form-group">
          <label htmlFor="expediente">Expediente</label>
          <input
            id="expediente"
            type="text"
            className="form-control"
            name="expediente"
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-control"
            name="proyectoTitle"
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="client">Client Wallet</label>
          <input
            id="client"
            type="text"
            className="form-control"
            name="clientAddress"
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="wallet">Owner Wallet</label>
          <input
            type="text"
            className="form-control"
            name="wallet"
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Owner Private Key">Owner Private Key</label>
          <input
            type="text"
            className="form-control"
            name="privateKey"
            onChange={handleInput}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Crear proyecto
        </button>
      </form>
      <h1>Created Projects</h1>
      {project.map(m => (
        <div>{m}</div>
      ))}
    </div>
  );
}

export default App;
