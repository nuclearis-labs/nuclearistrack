// NewProject.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { CustomModal } from '../components/CustomModal';
import RSKLink from '../components/RSKLink';
import Spinner from 'react-bootstrap/Spinner';

export default function NewProject() {
  const [form, setForm] = useState({});
  const [event, setEvent] = useState();
  const [users, setUsers] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const clients = data.filter(client => client.type === '0');
      setUsers(clients);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    axios({
      method: 'post',
      url: '/api/project/',
      data: {
        ...form
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        setLoading(false);
        setEvent(data);
        setModalShow(true);
      })
      .catch(e => {});
  }
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>
            NUEVO
            <br />
            PROYECTO
          </Title>
        </Top>
        <FormWrap>
          <Form>
            <Label>NOMBRE</Label>
            <Input
              type="text"
              name="proyectoTitle"
              value={form.proyectoTitle}
              onChange={handleInput}
            ></Input>
            <Label>CLIENTE</Label>
            <Select
              name="clientAddress"
              value={form.clientAddress}
              onChange={handleInput}
            >
              <option>Select one...</option>
              {users &&
                users.map(user => (
                  <option value={user.address} key={user.address}>
                    {user.name}
                  </option>
                ))}
            </Select>
            <Label>EXPEDIENTE</Label>
            <Input
              type="number"
              name="expediente"
              value={form.expediente}
              onChange={handleInput}
            ></Input>
            <Label>Nº OC</Label>
            <Input name="oc" value={form.oc} onChange={handleInput}></Input>
            <Button className="submit" onClick={handleSubmit}>
              {loading ? (
                <Spinner animation="border" role="status" size="sm"></Spinner>
              ) : (
                'CREAR'
              )}
            </Button>
            <CustomModal
              title="Project Creation Successfull"
              body={
                <>
                  <p>A new project was created successfully</p>
                  <ul>
                    <li>Name: {form.proyectoTitle}</li>
                    <li>
                      Transaction Hash:{' '}
                      <RSKLink hash={event} type="tx" testnet />
                    </li>
                  </ul>
                </>
              }
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
