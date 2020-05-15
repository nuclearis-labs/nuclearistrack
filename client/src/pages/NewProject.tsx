import React, { useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import {
  Title,
  Label,
  Input,
  PassphraseInput,
  Select,
  Button
} from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import I18n from '../i18n';
import useSWR from 'swr';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';

export default function NewProject() {
  const { register, handleSubmit, errors, setError, getValues } = useForm();
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  let history = useHistory();

  const { data } = useSWR('/api/user/get', url =>
    axios({
      url,
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(result => result.data)
  );

  function onSubmit() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/api/project/',
        data: getValues(),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.response.data));
    });
  }

  useEffect(() => {
    if (error !== null) {
      console.log(error);

      for (const key in error) {
        setError(key.replace('body.', ''), 'duplicate', error[key].message);
      }
    }
  }, [error]);

  useEffect(() => {
    if (value !== null) history.push('/projects');
  }, [value]);

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(execute)}>
          <Label>
            <I18n t="forms.projectTitle" />
          </Label>
          <Input
            type="text"
            ref={register({ required: 'This field is required' })}
            name="proyectoTitle"
          ></Input>
          <ErrorForm>
            {errors.proyectoTitle && errors.proyectoTitle.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.client" />
          </Label>
          <Select
            name="clientAddress"
            defaultValue=""
            ref={register({ required: 'This field is required' })}
          >
            <option disabled hidden value="">
              Select one...
            </option>
            {data &&
              data.map((user: any) => (
                <option value={user.address} key={user.address}>
                  {user.username}
                </option>
              ))}
          </Select>
          <ErrorForm>
            {errors.clientAddress && errors.clientAddress.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.expediente" />
          </Label>
          <Input
            type="number"
            name="expediente"
            ref={register({ required: 'This field is required' })}
          ></Input>
          <ErrorForm>
            {errors.expediente && errors.expediente.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.oc" />
          </Label>
          <Input
            ref={register({ required: 'This field is required' })}
            name="oc"
          ></Input>
          <ErrorForm>{errors.oc && errors.oc.message}</ErrorForm>
          <div style={{ marginTop: '30px' }}>
            <PassphraseInput
              type="password"
              placeholder="Ingresar clave"
              ref={register({ required: 'This field is required' })}
              name="passphrase"
            ></PassphraseInput>
            <Button disabled={pending} type="submit">
              CREAR
            </Button>
            <ErrorForm>
              {errors.passphrase && errors.passphrase.message}
            </ErrorForm>
          </div>
        </Form>
      </FormWrap>
      )}
      <Footer />
    </>
  );
}
