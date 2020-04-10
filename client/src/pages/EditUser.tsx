import React from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { Title, Label, ErrorLabel, Input, Button } from '../styles/components';
import Permits from '../components/Permits';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';

export default function EditUser() {
  const { user } = useAuth();
  const { register, handleSubmit, errors, getValues } = useForm();
  const { execute, pending, value } = useAsync(onSubmit, false);

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      axios({
        method: 'post',
        url: '/api/user/',
        data: {
          ...form,
          email: user.userEmail
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(({ data }) => resolve(data.userID))
        .catch(e => reject(e.message));
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      {value ? (
        <FormWrap>
          <Form>
            <p>Un nuevo usuario fue creado!</p>
            <ul>Identificación de usuario: {value}</ul>
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
                pattern: /^((?!\.)[\w-_.]*[^.])(@\S+)(\.\w+(\.\w+)?[^.\W])$/
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyItems: 'space-around'
              }}
            >
              <div style={{ paddingRight: '50px' }}>
                <Label>Proyectos</Label>
                <Permits
                  text="Crear"
                  name="roles"
                  value="project:create"
                  id="createProjects"
                  form={register}
                />
                <Permits
                  text="Ver"
                  name="roles"
                  value="project:read"
                  id="readProjects"
                  form={register}
                />
                <Permits
                  text="Cambiar estados"
                  name="roles"
                  value="project:changeState"
                  id="readProjects"
                  form={register}
                />
              </div>
              <div style={{ paddingRight: '50px' }}>
                <Label>Procesos</Label>
                <Permits
                  text="Ver"
                  name="roles"
                  value="process:read"
                  id="readProcess"
                  form={register}
                />
                <Permits
                  text="Crear"
                  name="roles"
                  value="process:create"
                  id="createProcess"
                  form={register}
                />
                <Permits
                  text="Asignar"
                  name="roles"
                  value="process:assign"
                  id="createProcess"
                  form={register}
                />
              </div>
              <div style={{ paddingRight: '50px' }}>
                <Label>Documentos</Label>
                <Permits
                  text="Cargar"
                  name="roles"
                  value="document:create"
                  id="uploadDocument"
                  form={register}
                />
                <Permits
                  text="Ver detalles"
                  name="roles"
                  value="document:read"
                  id="readDocument"
                  form={register}
                />
                <Permits
                  text="Ver todos"
                  name="roles"
                  value="documents:read"
                  id="readAllDocument"
                  form={register}
                />
              </div>
              <div style={{ paddingRight: '50px' }}>
                <Label>Admin</Label>
                <Permits
                  text="Gestionar usuarios"
                  name="roles"
                  value="admin:manageRoles"
                  id="manageRoles"
                  form={register}
                />
                <Permits
                  text="Transferir RBTC"
                  name="roles"
                  value="admin:transfer"
                  id="transfer"
                  form={register}
                />
              </div>
            </div>
            <ErrorLabel>
              {errors.userType && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Button
              className="submit"
              disabled={pending}
              onClick={handleSubmit(execute)}
            >
              {!pending ? <I18n t="forms.create" /> : 'LOADING'}
            </Button>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
