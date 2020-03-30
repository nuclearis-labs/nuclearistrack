import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import Footer from '../components/footer.js';
import { useForm } from 'react-hook-form';

export default function Transfer() {
  const { register, handleSubmit, watch, errors } = useForm();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/user/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      console.log(data);

      setUsers(data);
    });
  }, []);

  function onSubmit(form) {
    axios({
      method: 'post',
      url: '/api/transfer',
      data: { ...form },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      console.log(data);
    });
  }

  return (
    <>
      <Top>
        <Title>Transferencia</Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>Usuario</Label>
          <Select
            name="to"
            error={errors.to}
            ref={register({ required: true, validate: value => value !== '0' })}
            type="text"
          >
            <option value="0">Seleccionar uno...</option>
            {users.map(user => (
              <option value={user.address}>{user.name}</option>
            ))}
          </Select>
          <ErrorLabel>{errors.to && 'Este campo es obligatorio'}</ErrorLabel>
          <Label>Monto en RBTC</Label>
          <Input
            error={errors.value}
            name="value"
            ref={register({ required: true })}
            type="email"
          ></Input>
          <ErrorLabel>{errors.value && 'Este campo es obligatorio'}</ErrorLabel>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Enviar
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
