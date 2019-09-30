import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import NuclearPoE from './contracts/NuclearPoE';
import axios from 'axios';

function App() {
  const [block, setBlock] = useState({ number: 0 });
  const [inProgress, setInProgress] = useState(true);
  const [form, setForm] = useState([]);
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
  );

  const contract = new web3.eth.Contract(
    NuclearPoE.abi,
    '0xe6ef10eA5678fBDc9CC1FC051241Bf235393cbA0'
  );

  contract.events.allEvents().on('data', event => {
    if (event.event === 'CreateProject') {
      setInProgress(false);
      setBlock(event);
    }
  });

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setInProgress(true);
    axios.post('/api/project', form).then(response => {
      console.log(response);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Creación de nuevo proyecto</h1>
        {!inProgress ? (
          <div>
            <div>{form.expediente}</div>
            <div>{form.proyectoTitle}</div>
            <div>
              Dirección{' '}
              {block.returnValues &&
                block.returnValues.newProjectContractAddress}
            </div>
            <div>Transaction Hash {block.transactionHash}</div>
          </div>
        ) : (
          <div>Creation in process</div>
        )}
        <div>
          <label>Expediente</label>
          <input type="text" name="expediente" onChange={handleInput} />
        </div>
        <div>
          <label>proyectoTitle</label>
          <input type="text" name="proyectoTitle" onChange={handleInput} />
        </div>
        <div>
          <label>clientAddress</label>
          <input type="text" name="clientAddress" onChange={handleInput} />
        </div>
        <div>
          <label>wallet</label>
          <input type="text" name="wallet" onChange={handleInput} />
        </div>
        <div>
          <label>privateKey</label>
          <input type="text" name="privateKey" onChange={handleInput} />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Crear proyecto
        </button>
      </header>
    </div>
  );
}

export default App;
