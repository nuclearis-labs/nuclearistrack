import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Select,
  Button
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import axios from 'axios';
import Footer from '../components/footer.js';
import { useForm } from 'react-hook-form';
import Spinner from 'react-bootstrap/Spinner';
import I18n from '../i18n';

export default function Transfer(props) {
  const { register, handleSubmit, errors } = useForm();
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/user/get',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setUsers(data);
    });
  }, []);

  function onSubmit(form) {
    setLoading(true);

    axios({
      method: 'post',
      url: '/api/transfer',
      data: { ...form },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setLoading(false);

      setEvent(data);
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.transfer" />
        </Title>
      </Top>
      {event ? (
        <FormWrap>
          <Form>
            <p>La transferencia fue realizada con exito</p>
            <ul>
              <li>
                Transaction Hash: <RSKLink hash={event} type="tx" testnet />
              </li>
            </ul>
            <Button as={Link} to="/">
              CONTINUAR
            </Button>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form>
            <Label>
              <I18n t="forms.user" />
            </Label>
            <Select
              name="to"
              error={errors.to}
              ref={register({
                required: true,
                validate: value => value !== '0'
              })}
              type="text"
            >
              <option value="0">
                {I18n.getTranslation(props.location, 'forms.selectOne')}
              </option>
              {users.map(user => (
                <option key={user.address} value={user.address}>
                  {user.username}
                </option>
              ))}
            </Select>
            <ErrorLabel>{errors.to && 'Este campo es obligatorio'}</ErrorLabel>
            <Label>
              <I18n t="forms.amount" />
            </Label>
            <Input
              error={errors.value}
              name="value"
              ref={register({ required: true })}
              type="email"
            ></Input>
            <ErrorLabel>
              {errors.value && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              {loading ? (
                <Spinner animation="border" role="status" size="sm"></Spinner>
              ) : (
                <I18n t="forms.send" />
              )}
            </Button>
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
