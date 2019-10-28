import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

function Details({ data }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <p>
        <b>Name</b> {data.userName}
      </p>
      <p>
        <b>Balance</b> {data.balance} RBTC
      </p>
    </div>
  );
}

function UserDetailTableBody({ projects }) {
  return (
    <>
      {projects &&
        projects.map(([nombre, expediente, oc, contrato]) => {
          return (
            <tr key={expediente}>
              <td>{nombre}</td>
              <td>{expediente}</td>
              <td>{oc}</td>
              <td>
                <a href={`https://explorer.testnet.rsk.co/address/${contrato}`}>
                  {contrato}
                </a>
              </td>
            </tr>
          );
        })}
    </>
  );
}

function ClientDetail() {
  let { address } = useParams();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log(address);
    axios.post('/api/user/get/' + address).then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, [address]);

  return (
    <div className="container-fluid">
      <h1>Resumen de Cliente</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Details data={data} />
          <h3 style={{ margin: '5px 0' }}>Proyectos</h3>
          <Table
            body={<UserDetailTableBody projects={data.proyectos} />}
            columns={['Nombre', 'Expediente', 'Nº de OC', 'Contrato']}
            options={{ currentPage: 1 }}
          ></Table>
        </>
      )}
    </div>
  );
}

export default ClientDetail;
