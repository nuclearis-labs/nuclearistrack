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
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    console.log(e);
    // e.preventDefault();
    // setLoading(true);
    // const user = getCurrentUser();
    // axios({
    //   method: 'post',
    //   url: '/api/user/',
    //   data: {
    //     ...form,
    //     email: user.userEmail
    //   },
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // })
    //   .then(result => {
    //     if (result.data.error) {
    //     } else {
    //       setLoading(false);
    //       setEvent(result.data);
    //     }
    //   })
    //   .catch(e => {
    //     setEvent();
    //   });
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
            <Label>
              <I18n t="forms.type" />
            </Label>
            <Select
              error={errors.userType}
              name="userType"
              ref={register({
                validate: value => value === '0' || value === '1'
              })}
            >
              <option>
                <I18n t="forms.selectOne" />
              </option>
              <option value="1">
                <I18n t="general.supplier" />
              </option>
              <option value="0">
                <I18n t="general.client" />
              </option>
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
