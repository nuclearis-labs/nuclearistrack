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
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export const ListProject = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/project/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setProjects(data);
    });
  }, []);

  return (
    <>
      <Top>
        <Title>Listado de proyectos</Title>
      </Top>
      <FormWrap>
        <Form>
          <table cellPadding={10}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cliente</th>
                <th>Expediente</th>
                <th>OC</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(({ title, clientName, id, oc }) => (
                <tr>
                  <td>{title}</td>
                  <td>{clientName}</td>
                  <td>{id}</td>
                  <td>{oc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
};
