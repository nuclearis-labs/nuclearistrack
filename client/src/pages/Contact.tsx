import React from 'react';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import { Label, Input, TextArea, Button } from '../styles/components';
import I18n from '../i18n';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import axios from 'axios';

export default function Contact() {
  const { register, handleSubmit, getValues, errors } = useForm();
  const { execute, pending } = useAsync(onSubmit, false);

  function onSubmit() {
    return new Promise((resolve, reject) => {
      const form = getValues();
      axios({ method: 'post', url: '/api/contact/', data: { ...form } })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.message));
    });
  }
  return (
    <>
      <Top>
        <Title>
          <I18n t="contact.title" />
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>
            <I18n t="contact.name" />
          </Label>
          <Input
            name="name"
            error={errors.name}
            ref={register({ required: true })}
            type="text"
          ></Input>
          <Label>
            <I18n t="contact.email" />
          </Label>
          <Input
            name="email"
            error={errors.email}
            ref={register({ required: true })}
            type="email"
          ></Input>
          <Label>
            <I18n t="contact.message" />
          </Label>
          <TextArea
            error={errors.message}
            name="message"
            ref={register({ required: true })}
          ></TextArea>
          <Button
            type="submit"
            disabled={pending}
            onClick={handleSubmit(execute)}
          >
            <I18n t="contact.submit" />
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
