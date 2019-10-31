import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';

function Details({ data }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <p>
        <b>Name</b> {data.userName}
      </p>
      <p>
        <b>Address</b> {data.address}
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
        projects.map(({ title, expediente, oc }) => {
          return (
            <tr key={expediente}>
              <td>
                <Link to={'/project-detail/' + expediente}>{title}</Link>
              </td>
              <td>{expediente}</td>
              <td>{oc}</td>
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
    axios.get('/api/user/get/' + address).then(({ data }) => {
      data.address = address;
      console.log(data);

      setData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <h1>Client Details</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Details data={data} />
          <h3>Proyectos</h3>
          <Table
            body={<UserDetailTableBody projects={data.proyectos} />}
            columns={['Name', 'Expediente', 'Purchase Order']}
            options={{ currentPage: 1 }}
          ></Table>
        </>
      )}
    </div>
  );
}

export default ClientDetail;
