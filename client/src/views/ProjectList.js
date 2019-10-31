import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import CogIcon from '../components/CogIcon';
import CheckIcon from '../components/CheckIcon';
import RSKLink from '../components/RSKLink';

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
          ({ title, clientName, clientAddress, expediente, oc, status }, i) => {
            return (
              <tr key={i}>
                <td>
                  {status === 'pending' ? (
                    <>{title}</>
                  ) : (
                    <Link to={'/project-detail/' + expediente}>{title}</Link>
                  )}
                </td>
                <td>
                  <Link to={'/client-detail/' + clientAddress}>
                    {clientName}
                  </Link>
                </td>
                <td>{expediente}</td>
                <td>{oc}</td>
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
      method: 'get',
      url: '/api/project/get',
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
          columns={['Name', 'Client', 'Expedient', 'Purchase Order', 'Status']}
        ></Table>
      )}
    </div>
  );
}

export default ProjectList;
