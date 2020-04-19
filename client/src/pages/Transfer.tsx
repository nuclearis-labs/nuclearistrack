import React from 'react';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import { Title, Label, Input, Select, Button } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import axios from 'axios';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import I18n from '../i18n';
import useSWR from 'swr';
import { useAsync } from '../hooks/useAsync';
import { RouteProps } from 'react-router';
import { IUser } from '../types/user';
import { Formik } from 'formik';

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

  interface MyFormValues {
    to: string;
    value: string;
  }

  const initialValues: MyFormValues = {
    to: '',
    value: ''
  };

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
          <Formik
            initialValues={initialValues}
            onSubmit={values => console.log(values)}
          >
            <Form>
              <Label>
                <I18n t="forms.user" />
              </Label>
              <Select name="to">
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
              <Label>
                <I18n t="forms.amount" />
              </Label>
              <Input name="value" type="number"></Input>
              <Button type="submit">
                {!pending ? <I18n t="forms.create" /> : 'LOADING'}
              </Button>
            </Form>
          </Formik>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}
