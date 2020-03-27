// NewProject.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
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
import RSKLink from '../components/RSKLink';
import Spinner from 'react-bootstrap/Spinner';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';

export default function NewProject() {
  const [form, setForm] = useState({});
  const [event, setEvent] = useState();
  const [users, setUsers] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const clients = data.filter(client => client.type === '0');
      setUsers(clients);
    });
  }, []);

  function onSubmit(e) {
    e.preventDefault();
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
        setModalShow(true);
      })
      .catch(e => {});
  }
  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
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
                  {user.name}
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
          <Button className="submit" onClick={handleSubmit(onSubmit)}>
            {loading ? (
              <Spinner animation="border" role="status" size="sm"></Spinner>
            ) : (
              'CREAR'
            )}
          </Button>
          {modalShow && (
            <Modal
              title="Nuevo proyecto creado"
              show={modalShow}
              setShow={setModalShow}
            >
              <>
                <p style={{ textDecoration: 'underline' }}>Detalles </p>
                <ul>
                  <li>Name: {form.proyectoTitle}</li>
                  <li>
                    Transaction Hash: <RSKLink hash={event} type="tx" testnet />
                  </li>
                </ul>
              </>
            </Modal>
          )}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
