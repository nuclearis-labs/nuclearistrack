import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import ConfirmTx from '../components/ConfirmTx';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { format } from 'url';
import Hash from '../components/Hash';

function ProjectDetailTableBody({ process }) {
  let { contract } = useParams();
  console.log(process);

  if (process.length === 0) {
    return (
      <tr>
        <td colSpan="3" className="text-center">
          No processes available
        </td>
      </tr>
    );
  }
  return (
    <>
      {process &&
        process.map(
          ({ processName, supplierName, allDocuments, contractAddress }, i) => {
            return (
              <tr key={i}>
                <td>{processName}</td>
                <td>{supplierName}</td>
                <td>
                  {allDocuments.map(documento => (
                    <div>
                      <Link
                        to={`/document-detail/${contractAddress}/${documento}`}
                      >
                        <Hash hash={documento} lengthBothSides={6} />
                      </Link>
                    </div>
                  ))}
                </td>
              </tr>
            );
          }
        )}
    </>
  );
}

function ProjectDetail() {
  let { contract } = useParams();

  const [projects, setProjects] = useState();
  const [processes, setProcesses] = useState();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios.get('/api/project/get/' + contract).then(({ data }) => {
      console.log(data);
      setProjects(data);
      axios
        .get('/api/process/getByExpediente/' + data.expediente)
        .then(({ data }) => {
          console.log(data);

          setProcesses(data);
          setLoading(false);
        });
    });
  }, [contract]);

  return (
    <div className="container">
      <h1>Detalle de Proyecto</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Details projects={projects} />
          <h3 style={{ margin: '5px 0' }}>Process</h3>
          <Table
            body={<ProjectDetailTableBody process={processes} />}
            columns={['Name', 'Supplier', 'Documents']}
            options={{ currentPage: 1 }}
          ></Table>
        </>
      )}
    </div>
  );
}

function Details({ projects }) {
  console.log(projects);

  if (projects.hasOwnProperty('active')) {
    const {
      title,
      active,
      clientName,
      clientAddress,
      expediente,
      oc
    } = projects;
    console.log(projects);

    return (
      <div style={{ marginTop: '30px' }}>
        <p>
          <b>Name</b> {title}
        </p>
        <p>
          <b>Client</b>{' '}
          <Link to={'/client-detail/' + clientAddress}>{clientName}</Link>
        </p>
        <p>
          <b>Expediente</b> {expediente}
        </p>
        <p>
          <b>Purchase Order</b> {oc}
        </p>
        <p>
          <b>Status</b> {active ? 'Active' : 'Closed'}
        </p>
      </div>
    );
  } else {
    return <Loader />;
  }
}

export default ProjectDetail;
