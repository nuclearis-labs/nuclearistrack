import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useParams, Link } from 'react-router-dom';

function ProjectDetail() {
  let { contract } = useParams();

  const [projects, setProjects] = useState({});
  const [process, setProcess] = useState({});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios.post('/api/project/get/' + contract).then(({ data }) => {
      console.log(data);
      setProjects(data);
    });
    axios.post(`/api/process/getAll/${contract}`).then(({ data }) => {
      setProcess(data[0]);
      setLoading(false);
    });
  }, []);

  function approve() {
    axios
      .post(`/api/project/approve/${contract}`, {
        email: 'info@nasa.com',
        passphrase: 'nasa'
      })
      .then(result => console.log(result));
  }

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
        <div style={{ marginTop: '30px' }}>
          <p>
            <b>Title</b> {projects[0]}
          </p>
          <p>
            <b>Cliente</b>{' '}
            <Link to={'/client-detail/' + projects[2]}>{projects[1]}</Link>
          </p>
          <p>
            <b>Expediente</b> {projects[3]}
          </p>
          <p>
            <b>Nº de OC</b> {projects[4]}
          </p>
          <p>
            <b>Aprobado</b>{' '}
            {projects[5] ? (
              'Aprobado'
            ) : (
              <button onClick={approve}>Aprobar como NA-SA</button>
            )}
          </p>
          <p>
            <b>Contrato</b> {projects[8]}
          </p>

          <h3 style={{ margin: '5px 0' }}>Procesos</h3>
          <Table
            data={process}
            columns={['Nombre', 'Proveedor', 'Documentos']}
            options={{ currentPage: 1 }}
          ></Table>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
