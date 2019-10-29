import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import CogIcon from '../components/CogIcon';
import CheckIcon from '../components/CheckIcon';

function ProjectListTableBody({ projects }) {
  if (projects.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          No projects available
        </td>
      </tr>
    );
  }
  return (
    <>
      {projects &&
        projects.map(
          (
            [nombre, cliente, expediente, oc, contrato, clientAddress, status],
            i
          ) => {
            return (
              <tr key={i}>
                <td>
                  {status === 'pending' ? (
                    <>{nombre}</>
                  ) : (
                    <Link to={'/project-detail/' + contrato}>{nombre}</Link>
                  )}
                </td>
                <td>
                  <Link to={'/client-detail/' + clientAddress}>{cliente}</Link>
                </td>
                <td>{expediente}</td>
                <td>{oc}</td>
                <td>
                  {status === 'pending' ? (
                    <a
                      href={`https://explorer.testnet.rsk.co/tx/${contrato}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contrato}
                    </a>
                  ) : (
                    <a
                      href={`https://explorer.testnet.rsk.co/address/${contrato}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contrato}
                    </a>
                  )}
                </td>
                <td>{status === 'pending' ? <CogIcon /> : <CheckIcon />}</td>
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
    <div className="container">
      <h1>Project List</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          body={<ProjectListTableBody projects={projects} />}
          columns={[
            'Name',
            'Client',
            'Expedient',
            'Purchase Order',
            'Contract Address',
            'Status'
          ]}
        ></Table>
      )}
    </div>
  );
}

export default ProjectList;
