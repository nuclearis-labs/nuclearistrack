import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { useParams, Link } from 'react-router-dom';

function ProjectDetailTableBody({ process }) {
  let { contract } = useParams();

  return (
    <>
      {process &&
        process.map(([nombre, proveedor, documentos], i) => {
          return (
            <tr key={i}>
              <td>{nombre}</td>
              <td>{proveedor}</td>
              <td>
                {documentos.map(documento => (
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

function approve(contract) {
  axios
    .post(`/api/project/approve/${contract}`, {
      email: 'info@nasa.com',
      passphrase: 'nasa'
    })
    .then(result => console.log(result));
}

function ProjectDetail() {
  let { contract } = useParams();

  const [projects, setProjects] = useState();
  const [process, setProcess] = useState({});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    axios.post('/api/project/get/' + contract).then(({ data }) => {
      setProjects(data);
    });
    axios.post(`/api/process/getAll/${contract}`).then(({ data }) => {
      setProcess(data[0]);
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
          <h3 style={{ margin: '5px 0' }}>Procesos</h3>
          <Table
            body={<ProjectDetailTableBody process={process} />}
            columns={['Nombre', 'Proveedor', 'Documentos']}
            options={{ currentPage: 1 }}
          ></Table>
        </>
      )}
    </div>
  );
}

function Details(projects) {
  console.log(projects);

  if (projects.projects !== undefined) {
    const [
      nombre,
      clientName,
      clientAddress,
      expediente,
      oc,
      approved,
      ,
      ,
      contrato
    ] = projects.projects;

    return (
      <div style={{ marginTop: '30px' }}>
        <p>
          <b>Title</b> {nombre}
        </p>
        <p>
          <b>Cliente</b>{' '}
          <Link to={'/client-detail/' + clientAddress}>{clientName}</Link>
        </p>
        <p>
          <b>Expediente</b> {expediente}
        </p>
        <p>
          <b>Nº de OC</b> {oc}
        </p>
        <p>
          <b>Aprobado</b>{' '}
          {approved ? (
            'Aprobado'
          ) : (
            <button
              onClick={() => {
                approve(contrato);
              }}
            >
              Aprobar como NA-SA
            </button>
          )}
        </p>
        <p>
          <b>Contrato</b>{' '}
          <a
            href={`https://explorer.testnet.rsk.co/address/${contrato}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contrato}
          </a>
        </p>
      </div>
    );
  } else {
    return <Loader />;
  }
}

export default ProjectDetail;
