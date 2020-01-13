import React, { useState, useEffect } from 'react';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import axios from 'axios';

export const ListProcess = () => {
  const [process, setProcess] = useState([]);
  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/process/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setProcess(data);
    });
  }, []);

  return (
    <Wrap>
      <Top>
        <Title>Listado de procesos</Title>
      </Top>
      <FormWrap>
        <Form>
          <table cellPadding={10}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Contrato</th>
              </tr>
            </thead>
            <tbody>
              {process.map(
                ({ processName, supplierName, processContracts }) => (
                  <tr>
                    <td>{processName}</td>
                    <td>{supplierName}</td>
                    <td>{processContracts}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Form>
      </FormWrap>
    </Wrap>
  );
};
