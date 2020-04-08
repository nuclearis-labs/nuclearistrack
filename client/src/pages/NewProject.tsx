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
import { Top, Form, FormWrap } from '../styles/form';
import RSKLink from '../components/RSKLink';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import useSWR from 'swr';

export default function NewProject() {
  const { register, handleSubmit, errors, getValues } = useForm();
  const { execute, pending, value } = useAsync(onSubmit, false);
  const { data, error } = useSWR('/api/user/get', url =>
    axios.get(url).then(result => result.data)
  );

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
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
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.message));
    });
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProject" />
        </Title>
      </Top>
      {value ? (
        <FormWrap>
          <Form>
            <p>El proyecto fue creado con exito</p>
            <ul>
              <li>
                Transaction Hash: <RSKLink hash={value} type="tx" testnet />
              </li>
            </ul>
          </Form>
        </FormWrap>
      ) : (
        <FormWrap>
          <Form>
            <Label>
              <I18n t="forms.projectTitle" />
            </Label>
            <Input
              type="text"
              error={errors.proyectoTitle}
              ref={register({ required: true })}
              name="proyectoTitle"
            ></Input>
            <ErrorLabel>
              {errors.proyectoTitle && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.client" />
            </Label>
            <Select
              name="clientAddress"
              error={errors.clientAddress}
              ref={register({ validate: value => value !== 'Select one...' })}
            >
              <option>Select one...</option>
              {data &&
                data.map(user => (
                  <option value={user.address} key={user.address}>
                    {user.username}
                  </option>
                ))}
            </Select>
            <ErrorLabel>
              {errors.clientAddress && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.expediente" />
            </Label>
            <Input
              type="number"
              name="expediente"
              error={errors.expediente}
              ref={register({ required: true })}
            ></Input>
            <ErrorLabel>
              {errors.expediente && 'Este campo es obligatorio'}
            </ErrorLabel>
            <Label>
              <I18n t="forms.oc" />
            </Label>
            <Input
              name="oc"
              error={errors.oc}
              ref={register({ required: true })}
            ></Input>
            <ErrorLabel>{errors.oc && 'Este campo es obligatorio'}</ErrorLabel>
            <div>
              <Input
                placeholder="ingresar clave"
                style={{
                  width: '100px',
                  position: 'relative',
                  top: '60px',
                  marginRight: '5px'
                }}
                error={errors.oc}
                ref={register({ required: true })}
                name="passphrase"
              ></Input>
              <Button
                style={{ display: 'inline-block', position: 'relative' }}
                className="submit"
                disabled={pending}
                onClick={handleSubmit(execute)}
              >
                {!pending ? <I18n t="forms.create" /> : 'LOADING'}
              </Button>
            </div>
          </Form>
        </FormWrap>
      )}

      <Footer />
    </>
  );
}
