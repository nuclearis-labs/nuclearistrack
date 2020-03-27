// newProvider.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import Modal from '../components/Modal';
import RSKLink from '../components/RSKLink';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Spinner from 'react-bootstrap/Spinner';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';

export default function NewProcess() {
  const [users, setUsers] = useState();
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const suppliers = data.filter(user => user.type === '1');
      setUsers(suppliers);
      console.log(data);
    });
  }, []);

  function onSubmit(form) {
    console.log(form);

    // setLoading(true);
    // axios({
    //   method: 'post',
    //   url: '/api/process/',
    //   data: { ...form },
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   }
    // })
    //   .then(({ data }) => {
    //     setLoading(false);
    //     setEvent(data);
    //   })
    //   .catch(e => setLoading(false));
  }
  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProcess" />
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input name="processTitle" ref={register({ required: true })}></Input>
          <Label>
            <I18n t="forms.supplier" />
          </Label>
          <Select name="supplierAddress" ref={register({ required: true })}>
            <option>Select one...</option>
            {users &&
              users.map(user => (
                <option value={user.address} key={user.address}>
                  {user.name}
                </option>
              ))}
          </Select>
          <Button className="submit" onClick={handleSubmit(onSubmit)}>
            {loading ? (
              <Spinner animation="border" role="status" size="sm"></Spinner>
            ) : (
              'CREAR'
            )}
          </Button>
        </Form>
      </FormWrap>
      <FormWrap>
        <Form>
          <p style={{ textDecoration: 'underline' }}>Detalles</p>
          <ul>
            <li>Name: {form.processTitle}</li>
            <li>Transaction Hash:</li>
          </ul>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
