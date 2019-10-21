import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';

function ProjectList() {
  const [projects, setProjects] = useState({});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .post('/api/project/getAll')
      .then(({ data }) => {
        console.log(data);

        setProjects(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div className="container-fluid">
      <h1>Lista de Proyectos</h1>
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
        <Table
          data={projects}
          columns={[
            'Nombre',
            'Cliente',
            'Expediente',
            'Nº de OC',
            'Contrato',
            '',
            ''
          ]}
          additionalFields={['project-detail', 'add-process']}
          options={{ currentPage: 1 }}
        ></Table>
      )}
    </div>
  );
}

export default ProjectList;
