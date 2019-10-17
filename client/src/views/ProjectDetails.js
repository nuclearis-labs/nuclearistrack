import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  let { contract } = useParams();
  console.log(contract);

  const [projects, setProjects] = useState({});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios.post('/api/project/get/' + contract).then(({ data }) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-fluid">
      <h1>Detalle de Proyecto</h1>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div
            className="spinner-border"
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <p>
            <b>Title</b> {projects[0]}
          </p>
          <p>
            <b>Cliente</b> {projects[1]}
          </p>
          <p>
            <b>Expediente</b> {projects[2]}
          </p>
          <p>
            <b>Nº de OC</b> {projects[3]}
          </p>
          <p>
            <b>Aprobado</b> {projects[4] ? 'Aprobado' : 'No aprobado'}
          </p>
          <p>
            <b>Documents</b> {projects[5]}
          </p>
          <p>
            <b>Supplier</b> {projects[6]}
          </p>
          <p>
            <b>Address</b> {projects[7]}
          </p>
        </>
      )}
    </div>
  );
}

export default ProjectDetails;
