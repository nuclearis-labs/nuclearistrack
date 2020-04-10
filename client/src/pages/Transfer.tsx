import React from 'react';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Select,
  Button
} from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import axios from 'axios';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import I18n from '../i18n';
import useSWR from 'swr';
import { useAsync } from '../hooks/useAsync';
import { RouteProps } from 'react-router';
import { IUser } from '../types/user';

export default function Transfer(props: RouteProps) {
  const { register, handleSubmit, errors, getValues } = useForm();
  const { execute, pending, value } = useAsync(onSubmit, false);
  const { data } = useSWR('/api/user/get', url =>
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(({ data }) => data)
  );

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      axios({
        method: 'post',
        url: '/api/transfer',
        data: { ...form },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.message));
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.transfer" />
        </Title>
      </Top>
      {value ? (
        <FormWrap>
          <Form>
            <p>La transferencia fue realizada con exito</p>
            <ul>
              <li>
                Transaction Hash: <RSKLink hash={value} type="tx" testnet />
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
            >
              <option value="0">
                {I18n.getTranslation(props.location, 'forms.selectOne')}
              </option>
              {data &&
                data.map((user: IUser) => (
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
            <Button
              type="submit"
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
