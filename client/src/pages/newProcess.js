// newProvider.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import {
  Title,
  Label,
  Input,
  Select,
  TextArea,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';

export default function NewProcess() {
  const { contextUser } = useContext(UserContext);
  const [users, setUsers] = useState();
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const suppliers = data.filter(user => user.type === '1');
      setUsers(suppliers);
    });
  }, []);

  function resetState() {
    setEvent();
    setForm([]);
    setError(false);
    setSending(false);
  }

  function handleSubmit(e) {
    setSending(true);
    e.preventDefault();
    axios({
      method: 'post',
      url: '/api/process/',
      data: { ...form, email: contextUser.userEmail, passphrase: 'Nuclearis' },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        setSending(false);
        setEvent(data);
      })
      .catch(e => {
        setError();
      });
  }
  return (
    <Wrap>
      <Top>
        <Title>
          NUEVO
          <br />
          PROCESO
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>NOMBRE</Label>
          <Input name="processTitle" onChange={handleInput}></Input>
          <Label>PROVEEDOR</Label>
          <Select name="supplierAddress" onChange={handleInput}>
            <option>Select one...</option>
            {users &&
              users.map(user => (
                <option value={user.address} key={user.address}>
                  {user.name}
                </option>
              ))}
          </Select>
          <Button className="submit" onClick={handleSubmit}>
            CREAR
          </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
