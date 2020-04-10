// newProvider.js
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Select,
  Button
} from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import RSKLink from '../components/RSKLink';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import useSWR from 'swr';
import { IUser } from '../types/user';

export default function NewProcess() {
  const { register, handleSubmit, getValues, errors } = useForm();
  const { execute, pending, value } = useAsync(onSubmit, false);
  const { data } = useSWR('/api/user/get', url =>
    axios.get(url).then(result => result.data)
  );

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      axios({
        method: 'post',
        url: '/api/process/',
        data: { ...form },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.message));
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProcess" />
        </Title>
      </Top>
      {value ? (
        <FormWrap>
          <Form>
            <p>El proceso fue creado con exito</p>
            <ul>
              <li>
                Transaction Hash: <RSKLink hash={value} type="tx" testnet />
              </li>
            </ul>
            <Button as={Link} to="/processes">
              VER PROCESOS
            </Button>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form>
            <Label>
              <I18n t="forms.name" />
            </Label>
            <Input
              error={errors.processTitle}
              name="processTitle"
              ref={register({ required: true })}
            ></Input>
            <ErrorLabel>
              {errors.processTitle && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.supplier" />
            </Label>
            <Select
              error={errors.supplierAddress}
              name="supplierAddress"
              ref={register({
                required: true,
                validate: value => value !== '0'
              })}
            >
              <option value="0">Select one...</option>
              {data &&
                data.map((user: IUser) => (
                  <option value={user.address} key={user.address}>
                    {user.username}
                  </option>
                ))}
            </Select>
            <ErrorLabel>
              {errors.supplierAddress &&
                errors.supplierAddress.type === 'validate' &&
                'Este campo es obligatorio'}
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
