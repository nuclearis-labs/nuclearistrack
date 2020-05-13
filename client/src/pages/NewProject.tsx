import React from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
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
import I18n from '../i18n';
import useSWR from 'swr';
import { useHistory } from 'react-router-dom';

export default function NewProject() {
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
      url: '/api/project/',
      data: {
        ...form
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        localStorage.setItem('pendingTx', data);
        history.push('/projects');
      })
      .catch(e => setError('ERROR: NO SE PUDO CREAR EL PROYECTO'));
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit}>
          <Label>
            <I18n t="forms.projectTitle" />
          </Label>
          <Input
            type="text"
            onChange={handleChange}
            name="proyectoTitle"
          ></Input>
          <Label>
            <I18n t="forms.client" />
          </Label>
          <Select name="clientAddress" onChange={handleChange}>
            <option>Select one...</option>
            {data &&
              data.map((user: any) => (
                <option value={user.address} key={user.address}>
                  {user.username}
                </option>
              ))}
          </Select>
          <Label>
            <I18n t="forms.expediente" />
          </Label>
          <Input
            type="number"
            onChange={handleChange}
            name="expediente"
          ></Input>
          <Label>
            <I18n t="forms.oc" />
          </Label>
          <Input onChange={handleChange} name="oc"></Input>
          <div>
            <Input
              type="password"
              placeholder="ingresar clave"
              style={{
                width: '100px',
                position: 'relative',
                top: '60px',
                marginRight: '5px'
              }}
              onChange={handleChange}
              name="passphrase"
            ></Input>
            <SubmitButton
              submitting={submitting}
              error={error}
              text="CREAR"
              loadingText="CREANDO..."
            />
          </div>
        </Form>
      </FormWrap>
      )}
      <Footer />
    </>
  );
}
