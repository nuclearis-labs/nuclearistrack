import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useParams } from 'react-router-dom';

function ClientDetail() {
  let { address } = useParams();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.post('/api/user/get/' + address).then(({ data }) => {
      console.log(data);

      setData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-fluid">
      <h1>Resumen de Cliente</h1>
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
        <>
          <div style={{ marginTop: '30px' }}>
            <p>
              <b>Nombre</b> {data.userName}
            </p>
          </div>

          <h3 style={{ margin: '5px 0' }}>Proyectos</h3>
          <Table
            data={data.proyectos}
            columns={['Nombre', 'Expediente', 'Nº de OC', 'Contrato']}
            options={{ currentPage: 1 }}
          ></Table>
        </>
      )}
    </div>
  );
}

export default ClientDetail;
