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
import SubmitButton from '../components/SubmitButton';
import { Top, Form, FormWrap } from '../styles/form';
import RSKLink from '../components/RSKLink';
import Footer from '../components/Footer';
import I18n from '../i18n';
import useSWR from 'swr';
import { IUser } from '../types/user';
import { useHistory } from 'react-router-dom';

export default function NewProcess() {
  const [form, setForm] = React.useState<any>({ roles: [] });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  let history = useHistory();

  const { data } = useSWR('/api/user/get', url =>
    axios.get(url).then(result => result.data)
  );

  function handleChange(evt: any) {
    evt.persist();
    if (submitting) setSubmitting(false);
    setForm((form: any) => ({
      ...form,
      [evt.target.name]: evt.target.value
    }));
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    setSubmitting(true);
    setError(null);
    axios({
      method: 'post',
      url: '/api/process/',
      data: { ...form },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => history.push('/processes'))
      .catch(e => setError('ERROR: NO SE PUDO CREAR EL PROCESO'));
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProcess" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit}>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input onChange={handleChange} name="processTitle"></Input>
          <Label>
            <I18n t="forms.supplier" />
          </Label>
          <Select onChange={handleChange} name="supplierAddress">
            <option value="0">Select one...</option>
            {data &&
              data.map((user: IUser) => (
                <option value={user.address} key={user.address}>
                  {user.username}
                </option>
              ))}
          </Select>
          <SubmitButton
            submitting={submitting}
            error={error}
            text="CREAR"
            loadingText="CREANDO..."
          />
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
