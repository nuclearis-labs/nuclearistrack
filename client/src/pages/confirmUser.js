// newProvider.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Title, Label, Input, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import Footer from '../components/footer.js';
import Header from '../components/header.js';
import Spinner from 'react-bootstrap/Spinner';

export default function ConfirmUser() {
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState({});
  const { id } = useParams();
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    axios({
      method: 'post',
      url: `/api/user/confirm/${id}`,
      data: {
        ...form
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(result => {
        setLoading(false);
        if (result.data.error) {
          setEvent(result.data.error);
        } else {
          setEvent(result.data);
          setForm([]);
        }
      })
      .catch(e => {
        setEvent('Not able to save User to the Blockchain, try later again');
      });
  }

  return (
    <>
      <Top>
        <Title>
          CONFIRM
          <br />
          USER
        </Title>
      </Top>
      {event.hasOwnProperty('address') ? (
        <FormWrap>
          <Form>
            <p>Su cuenta fue creada con exito!</p>
            <ul>
              <li>Nombre: {event && event.username}</li>
              <li>Correo electronico: {event && event.email}</li>
              <li>Clave Mnemonica: {event && event.mnemonic}</li>
              <li>Dirección: {event && event.address}</li>
              <li>
                Transaction:{' '}
                <RSKLink hash={event && event.txHash} type="tx" testnet />
              </li>
            </ul>
            <p>
              Les sugerimos de anotar en un medio seguro la clave mnemonica, ya
              que es la unica forma de recuperar su cuenta en caso de que se
              olvide la clave ingresada.
            </p>
            <Button as={Link} to="/users/add">
              OTRO USUARIO
            </Button>
          </Form>
        </FormWrap>
      ) : (
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
              {loading ? (
                <Spinner animation="border" role="status" size="sm"></Spinner>
              ) : (
                'CREAR'
              )}
            </Button>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
