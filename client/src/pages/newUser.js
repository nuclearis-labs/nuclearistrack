// newProvider.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import Modal from '../components/Modal';
import Header from '../components/header';
import Footer from '../components/footer';
import Spinner from 'react-bootstrap/Spinner';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';

export default function NewUser() {
  const { getCurrentUser } = useContext(UserContext);
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  function onSubmit(data) {
    setLoading(true);
    const user = getCurrentUser();
    axios({
      method: 'post',
      url: '/api/user/',
      data: {
        ...data,
        email: user.userEmail
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(result => {
        if (result.data.error) {
        } else {
          setLoading(false);
          setEvent(result.data);
        }
      })
      .catch(e => {
        setEvent();
      });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      {event ? (
        <FormWrap>
          <Form>
            <p>Un nuevo usuario fue creado!</p>
            <ul>Identificación de usuario: {event.userID}</ul>
            <p>Se envio un correo electronico al usuario nuevo,</p>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form>
            <Label>
              <I18n t="forms.name" />
            </Label>
            <Input
              error={errors.newUserName}
              type="text"
              ref={register({ required: true, minLength: 3 })}
              name="newUserName"
            ></Input>
            <ErrorLabel>
              {errors.newUserName && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.mail" />
            </Label>
            <Input
              error={errors.newUserEmail}
              ref={register({
                required: true,
                pattern: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
              })}
              type="email"
              name="newUserEmail"
            ></Input>
            <ErrorLabel>
              {errors.newUserEmail &&
                errors.newUserEmail.type === 'required' &&
                'Este campo es obligatorio'}
            </ErrorLabel>
            <ErrorLabel>
              {errors.newUserEmail &&
                errors.newUserEmail.type === 'pattern' &&
                'Se debe introducir un correo electronico'}
            </ErrorLabel>
            <Label>PERMISOS</Label>
            <Select error={errors.roles} multiple name="roles" ref={register}>
              <option value="project:create">Crear proyectos</option>
              <option value="project:read">Ver proyectos</option>
              <option value="process:create">Crear procesos</option>
              <option value="process:read">Ver procesos</option>
            </Select>
            <ErrorLabel>
              {errors.userType && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Button className="submit" onClick={handleSubmit(onSubmit)}>
              {loading ? (
                <Spinner animation="border" role="status" size="sm"></Spinner>
              ) : (
                <I18n t="forms.create" />
              )}
            </Button>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
