import React from 'react';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import { Title, Label, Input, Select, Button } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
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
      axios({
        method: 'post',
        url: '/api/transfer',
        data: getValues(),
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
        <TransactionSuccess {...{ value }} />
      ) : (
        <FormWrap>
          <Form>
            <Label>
              <I18n t="forms.user" />
            </Label>
            <Select ref={register({ required: true })} name="to">
              <option>
                {I18n.getTranslation(props.location, 'forms.selectOne')}
              </option>
              {data &&
                data.map((user: IUser) => (
                  <option key={user.address} value={user.address}>
                    {user.username}
                  </option>
                ))}
            </Select>
            <ErrorForm>
              {errors.to && <span>This field is required</span>}
            </ErrorForm>
            <Label>
              <I18n t="forms.amount" />
            </Label>
            <Input
              name="value"
              ref={register({ required: true })}
              type="number"
            ></Input>
            <ErrorForm>
              {errors.value && <span>This field is required</span>}
            </ErrorForm>

            <Button
              disabled={pending}
              onClick={handleSubmit(execute)}
              type="submit"
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

function TransactionSuccess(props: any) {
  return (
    <FormWrap>
      <Form>
        <p>La transferencia fue realizada con exito</p>
        <ul>
          <li>
            Transaction Hash: <RSKLink hash={props.value} type="tx" testnet />
          </li>
        </ul>
        <Button as={Link} to="/">
          CONTINUAR
        </Button>
      </Form>
    </FormWrap>
  );
}
