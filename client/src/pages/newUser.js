// newProvider.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
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

export default function NewUser() {
  const { contextUser } = useContext(UserContext);
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [modalShow, setModalShow] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
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
        if (result.data.error) {
        } else {
          setEvent(result.data);
          setModalShow(true);
        }
      })
      .catch(e => {
        setEvent();
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
          <CustomModal
            title="User Creation Successfull"
            body={
              <>
                <p>
                  A new user with the following information was successfully
                  saved in the Database.
                </p>
                <ul>
                  <li>Identificación: {event && event.userID}</li>
                  <li>Name: {form.newUserName}</li>
                  <li>Email: {form.newUserEmail}</li>
                  <li>
                    UserType: {form.userType === '0' ? 'Client' : 'Supplier'}
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
