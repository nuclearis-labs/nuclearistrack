import React from 'react';
import axios from 'axios';
import { useAsync } from '../hooks/useAsync';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Button,
  Select
} from '../styles/components';
import Permits from '../components/Permits';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import SubmitButton from '../components/SubmitButton';

export default function EditUser() {
  const [form, setForm] = React.useState<any>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  function handleChange(evt: any) {
    evt.persist();
    if (evt.target.name === 'roles') {
      setForm((form: any) => ({
        ...form,
        [evt.target.name]: [...form.roles, evt.target.value]
      }));
    } else {
      setForm((form: any) => ({
        ...form,
        [evt.target.name]: evt.target.value
      }));
    }
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    axios({
      method: 'post',
      url: '/api/user/',
      data: {
        ...form
        // email: user.userEmail
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      {!!submitting ? (
        <FormWrap>
          <Form>
            <p>Un nuevo usuario fue creado!</p>
            <ul>Identificación de usuario: </ul>
            <p>Se envio un correo electronico al usuario nuevo,</p>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form onSubmit={handleSubmit}>
            <Label>
              <I18n t="forms.name" />
            </Label>
            <Input
              type="text"
              onChange={handleChange}
              name="newUserName"
            ></Input>
            <Label>
              <I18n t="forms.mail" />
            </Label>
            <Input
              type="email"
              onChange={handleChange}
              name="newUserEmail"
            ></Input>
            <Label>PERMISOS</Label>
            <Select name="roles" multiple={true} onChange={handleChange}>
              <option>project:create</option>
              <option>project:read</option>
              <option>project:changeState</option>
              <option>process:read</option>
              <option>process:create</option>
              <option>process:assign</option>
              <option>document:create</option>
              <option>document:read</option>
              <option>documents:read</option>
              <option>admin:manageRoles</option>
              <option>admin:transfer</option>
            </Select>
            <SubmitButton
              submitting={submitting}
              error={error}
              text="EDITAR"
              loadingText="EDITANDO..."
            />
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
