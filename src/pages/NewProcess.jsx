// newProvider.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Title,
  Label,
  ErrorLabel,
  Input,
  Select,
  Button,
  PassphraseButton,
  PassphraseInput,
} from '../styles/components';
import Spinner from '../components/Spinner';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import RSKLink from '../components/RSKLink';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import { ProcessSchema } from '../validationSchemas/index';

export default function NewProcess() {
  const { register, handleSubmit, errors, setError, getValues } = useForm({
    validationSchema: ProcessSchema,
  });
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  let history = useHistory();

  function onSubmit() {
    console.log('submit');
  }

  useEffect(() => {
    if (value !== null) history.push('/processes');
  }, [value]);

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newProcess" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(execute)}>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input ref={register} name="processTitle"></Input>
          <ErrorForm>
            {errors.processTitle && errors.processTitle.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.supplier" />
          </Label>
          <Select ref={register} name="supplierAddress" defaultValue="">
            <option disabled hidden value="">
              Select one...
            </option>
            <option>User </option>
            ))}
          </Select>
          <ErrorForm>
            {errors.supplierAddress && errors.supplierAddress.message}
          </ErrorForm>
          <div style={{ marginTop: '30px' }}>
            <PassphraseInput
              type="password"
              placeholder="Ingresar clave"
              ref={register}
              name="passphrase"
            ></PassphraseInput>
            <PassphraseButton disabled={pending} type="submit">
              {pending ? <Spinner size="sm" color="white" /> : 'CREAR'}
            </PassphraseButton>
            <ErrorForm>
              {errors.passphrase && errors.passphrase.message}
            </ErrorForm>
          </div>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
