// NewProject.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/footer.js';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Select,
  Button
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import RSKLink from '../components/RSKLink';
import Spinner from 'react-bootstrap/Spinner';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';

export default function NewProject() {
  const [event, setEvent] = useState();
  const [, setError] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => setUsers(data));
  }, []);

  function onSubmit(form) {
    setLoading(true);
    axios({
      method: 'post',
      url: '/api/project/',
      data: {
        ...form
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        setLoading(false);
        setEvent(data);
      })
      .catch(e => setError(e));
  }
  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      {event ? (
        <FormWrap>
          <Form>
            <p>El proyecto fue creado con exito</p>
            <ul>
              <li>
                Transaction Hash: <RSKLink hash={event} type="tx" testnet />
              </li>
            </ul>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form>
            <Label>
              <I18n t="forms.projectTitle" />
            </Label>
            <Input
              type="text"
              error={errors.proyectoTitle}
              ref={register({ required: true })}
              name="proyectoTitle"
            ></Input>
            <ErrorLabel>
              {errors.proyectoTitle && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.client" />
            </Label>
            <Select
              name="clientAddress"
              error={errors.clientAddress}
              ref={register({ validate: value => value !== 'Select one...' })}
            >
              <option>Select one...</option>
              {users &&
                users.map(user => (
                  <option value={user.address} key={user.address}>
                    {user.username}
                  </option>
                ))}
            </Select>
            <ErrorLabel>
              {errors.clientAddress && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.expediente" />
            </Label>
            <Input
              type="number"
              name="expediente"
              error={errors.expediente}
              ref={register({ required: true })}
            ></Input>
            <ErrorLabel>
              {errors.expediente && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.oc" />
            </Label>
            <Input
              name="oc"
              error={errors.oc}
              ref={register({ required: true })}
            ></Input>
            <ErrorLabel>{errors.oc && 'Este campo es obligatorio'}</ErrorLabel>
            <div>
              <Input
                placeholder="ingresar clave"
                style={{
                  width: '100px',
                  position: 'relative',
                  top: '60px',
                  marginRight: '5px'
                }}
                error={errors.oc}
                ref={register({ required: true })}
                name="passphrase"
              ></Input>
              <Button
                style={{ display: 'inline-block', position: 'relative' }}
                className="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <Spinner animation="border" role="status" size="sm"></Spinner>
                ) : (
                  'CREAR'
                )}
              </Button>
            </div>
          </Form>
        </FormWrap>
      )}

      <Footer />
    </>
  );
}
