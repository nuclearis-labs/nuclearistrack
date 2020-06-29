import React, { useContext } from 'react';
import { Title, Label, Button, Input } from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { UserSchema } from '../validationSchemas/index';
import { DrizzleContext } from '@drizzle/react-plugin';

export default function NewUser() {
  const { drizzle } = useContext(DrizzleContext.Context);

  const { register, handleSubmit, errors } = useForm({
    validationSchema: UserSchema,
  });
  function onSubmit(data) {
    drizzle.contracts.NuclearPoE.methods
      .createUser(
        data.newUserType,
        data.newUserAddress,
        drizzle.web3.utils.asciiToHex(data.newUserName)
      )
      .send();
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input type="text" ref={register} name="newUserName"></Input>
          <ErrorForm>
            {errors.newUserName && errors.newUserName.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.address" />
          </Label>
          <Input type="text" ref={register} name="newUserAddress"></Input>
          <ErrorForm>
            {errors.newUserAddress && errors.newUserAddress.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.type" />
          </Label>
          <div>
            <Input
              style={{ width: '20px', height: 'unset' }}
              type="radio"
              ref={register}
              name="newUserType"
              value="1"
              id="client"
            ></Input>
            <label htmlFor="client">
              {' '}
              <I18n t="forms.client" />
            </label>
          </div>
          <div>
            <Input
              style={{ width: '20px', height: 'unset' }}
              type="radio"
              ref={register}
              name="newUserType"
              value="2"
              id="supplier"
            ></Input>
            <label htmlFor="supplier">
              {' '}
              <I18n t="forms.supplier" />
            </label>
          </div>
          <ErrorForm>
            {errors.newUserAddress && errors.newUserAddress.message}
          </ErrorForm>
          <Button type="submit">CREAR</Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
