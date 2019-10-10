import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import NuclearPoE from '../contracts/NuclearPoE';
import axios from 'axios';

function DocumentList() {
  const [project, setProject] = useState([]);
  const [inProgress, setInProgress] = useState();
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
  );

  const contract = new web3.eth.Contract(
    NuclearPoE.abi,
    '0xe6ef10eA5678fBDc9CC1FC051241Bf235393cbA0'
  );
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

  return (
    <div className="container mt-5">
      <h1>Listado de Projectos</h1>
      <table class="table mt-5">
        <thead>
          <tr>
            <th scope="col">NOMBRE</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">EXPEDIENTE</th>
            <th scope="col">Nº OC</th>
            <th scope="col">CONTRATO</th>
          </tr>
        </thead>
        <tbody>
          {project.map(m => (
            <tr>
              <td>{m}</td>
            </tr>
          ))}
          <tr>
            <td>Anillos 2020</td>
            <td>NA-SA</td>
            <td>54323</td>
            <td>4500107163</td>
            <td>0x4aDb652fcE9C527C69A6FaA0c9B937eF4e76fb2C</td>
          </tr>
          <tr>
            <td>Conjunto Soporte</td>
            <td>NA-SA</td>
            <td>34354</td>
            <td>4500108434</td>
            <td>0xF6b723D59B82401d2201087C4AA66d908951b6cb</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DocumentList;
