// newProvider.js
import React from 'react';
import { Title, Label, Input, Select } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { ProcessSchema } from '../validationSchemas/index';
import LoggedHeader from '../components/LoggedHeader';

export default function NewProcess() {
  const { register, handleSubmit, errors } = useForm({
    validationSchema: ProcessSchema,
  });

  function onSubmit(data) {
    console.log('submit');
  }

  return (
    <>
      <LoggedHeader />
      <Top>
        <Title>
          <I18n t="forms.newProcess" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
