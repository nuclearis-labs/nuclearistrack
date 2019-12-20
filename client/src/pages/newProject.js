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
import { CustomModal } from '../components/CustomModal';
import RSKLink from '../components/RSKLink';

export default function NewProvider() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState({});
  const [event, setEvent] = useState();
  const [users, setUsers] = useState();
  const [modalShow, setModalShow] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function resetState(e) {
    e.preventDefault();
    setEvent();
    setForm([]);
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const clients = data.filter(client => client.type === '0');
      setUsers(clients);
    });
  }, []);

  function handleSubmit(e) {
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
        setModalShow(true);
      })
      .catch(e => {});
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
          <CustomModal
            title="Project Creation Successfull"
            body={
              <>
                <p>A new project was created successfully</p>
                <ul>
                  <li>Name: {form.proyectoTitle}</li>
                  <li>
                    Cliente:{' '}
                    <RSKLink hash={form.clientAddress} type="account" testnet />
                  </li>
                  <li>
                    Transaction Hash:{' '}
                    <RSKLink hash={event && event.txHash} type="tx" testnet />
                  </li>
                </ul>
                <p>
                  Para completar la registración, el usuario recibe un correo
                  electronico.
                  <br />
                  El cual lo va a llevar a ingresar una contraseña secreta, con
                  la cual se genera la wallet del usuario.
                </p>
              </>
            }
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        </Form>
      </FormWrap>
    </Wrap>
  );
}
