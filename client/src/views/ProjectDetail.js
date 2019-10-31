import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { useParams, Link } from 'react-router-dom';
import Hash from '../components/Hash';
import { UserContext } from '../context/UserContext';

function ProjectDetailTableBody({ process }) {
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
      setProjects(data);
      axios
        .get('/api/process/getByExpediente/' + data.expediente)
        .then(({ data }) => {
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
  const { title, active, clientName, clientAddress, expediente, oc } = projects;
  const [form, setForm] = useState({});
  const { contextUser } = useContext(UserContext);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function closeProject(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: '/api/project/close/' + expediente,
      data: { ...form, email: contextUser.userEmail },
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }).then(result => console.log(result));
  }

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
      {active && (
        <div className="form-row">
          <div className="col">
            <button onClick={closeProject} className="btn btn-primary">
              Close Project
            </button>
          </div>
          <div className="col">
            <input
              className="form-control"
              onChange={handleInput}
              type="password"
              name="passphrase"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
