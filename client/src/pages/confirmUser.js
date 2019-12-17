// newProvider.js
import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
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

export default function ConfirmUser() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [error, setError] = useState(false);
  const [isSending, setSending] = useState(false);
  const { id } = useParams();

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
      url: `/api/user/confirm/${id}`,
      data: {
        ...form,
        email: contextUser.userEmail,
        passphrase: 'Nuclearis'
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
          CONFIRM
          <br />
          USER
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>PASSPHRASE</Label>
          <Input
            type="password"
            name="passphrase"
            onChange={handleInput}
          ></Input>
          <Label>CONFIRM PASSPHRASE</Label>
          <Input
            type="password"
            name="confirm_passphrase"
            onChange={handleInput}
          ></Input>

          <Button className="submit" onClick={handleSubmit}>
            CREAR
          </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
