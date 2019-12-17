// newProvider.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';

export default function NewProvider() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState({});
  const [event, setEvent] = useState();
  const [users, setUsers] = useState();
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function resetState(e) {
    e.preventDefault();
    setEvent();
    setForm([]);
    setError(false);
    setSending(false);
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const clients = data.filter(client => client.type === '0');
      setUsers(clients);
    });
  }, []);

  function handleSubmit(e) {
    setSending(true);
    e.preventDefault();
    axios({
      method: 'post',
      url: '/api/project/',
      data: {
        ...form,
        email: contextUser.userEmail,
        passphrase: 'Nuclearis'
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        resetState();
        setEvent(data);
        setSending(false);
      })
      .catch(e => {
        setSending(false);
        setError(e.message);
      });
  }
  return (
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
            CREAR
          </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
