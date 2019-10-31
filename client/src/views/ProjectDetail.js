import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import ConfirmTx from '../components/ConfirmTx';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { format } from 'url';

function ProjectDetailTableBody({ process }) {
  let { contract } = useParams();
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
        process.map(({ name, supplier, documents }, i) => {
          return (
            <tr key={i}>
              <td>{name}</td>
              <td>{supplier}</td>
              <td>
                {documents.map(documento => (
                  <div>
                    <Link to={`/document-detail/${contract}/${documento}`}>
                      {documento}
                    </Link>
                  </div>
                ))}
              </td>
            </tr>
          );
        })}
    </>
  );
}

function ProjectDetail() {
  let { contract } = useParams();

  const [projects, setProjects] = useState();
  const [process, setProcess] = useState({});
  const [approving, setApproving] = useState(false);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios.get('/api/project/get/' + contract).then(({ data }) => {
      console.log(data);
      setProjects(data);
      setLoading(false);
    });
  }, [contract]);

  return (
    <div className="container-fluid">
      <h1>Detalle de Proyecto</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Details projects={projects} />
          <h3 style={{ margin: '5px 0' }}>Process</h3>
          <Table
            body={
              <ProjectDetailTableBody process={projects.processContracts} />
            }
            columns={['Name', 'Supplier', 'Documents']}
            options={{ currentPage: 1 }}
          ></Table>
        </>
      )}
    </div>
  );
}

function Details({ projects }) {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState({});

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(contrato) {
    axios
      .post(`/api/project/approve/${contrato}`, {
        email: contextUser.userEmail,
        passphrase: form.passphrase
      })
      .then(result => console.log(result));
  }
  if (projects.lengt > 0) {
    const {
      title,
      active,
      clientName,
      clientAddress,
      expediente,
      oc,
      processContracts
    } = projects;

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
          <b>Estado</b> {active ? 'Active' : 'Closed'}
        </p>
      </div>
    );
  } else {
    return <Loader />;
  }
}

export default ProjectDetail;
