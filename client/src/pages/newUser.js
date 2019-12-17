// newProvider.js
import React, { useState, useContext } from 'react';
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

export default function NewUser() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

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
      url: '/api/user/',
      data: {
        ...form,
        email: contextUser.userEmail
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(result => {
        setSending(false);
        if (result.data.error) {
          setError(result.data.error);
        } else {
          setEvent(result.data);
        }
      })
      .catch(e => {
        setEvent();
        setSending(false);
        setError('Not able to save User to the Blockchain, try later again');
      });
  }

  return (
    <Wrap>
      <Top>
        <Title>
          NUEVO
          <br />
          USUARIO
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>NOMBRE</Label>
          <Input name="newUserName" onChange={handleInput}></Input>
          <Label>MAIL</Label>
          <Input type="mail" name="newUserEmail" onChange={handleInput}></Input>
          <Label>TIPO</Label>
          <Select name="userType" onChange={handleInput}>
            <option>Select one...</option>
            <option value="1">Proveedor</option>
            <option value="0">Cliente</option>
          </Select>
          <Button className="submit" onClick={handleSubmit}>
            CREAR
          </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
