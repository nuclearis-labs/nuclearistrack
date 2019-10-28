import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

function ProjectListTableBody({ projects }) {
  return (
    <>
      {projects &&
        projects.map(
          ([nombre, cliente, expediente, oc, contrato, clientAddress], i) => {
            return (
              <tr key={i}>
                <td>{nombre}</td>
                <td>
                  <Link to={'/client-detail/' + clientAddress}>{cliente}</Link>
                </td>
                <td>{expediente}</td>
                <td>{oc}</td>
                <td>
                  <a
                    href={`https://explorer.testnet.rsk.co/address/${contrato}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contrato}
                  </a>
                </td>
                <td>
                  <Link to={'/project-detail/' + contrato}>Ver</Link>
                </td>
                <td>
                  <Link to={'/add-process/' + contrato}>Agregar</Link>
                </td>
              </tr>
            );
          }
        )}
    </>
  );
}

function ProjectList() {
  const [projects, setProjects] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios({
      method: 'post',
      url: '/api/project/getAll',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    })
      .then(({ data }) => {
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
        <Loader />
      ) : (
        <Table
          body={<ProjectListTableBody projects={projects} />}
          columns={[
            'Nombre',
            'Cliente',
            'Expediente',
            'Nº de OC',
            'Contrato',
            'Detalles',
            'Procesos'
          ]}
        ></Table>
      )}
    </div>
  );
}

export default ProjectList;
