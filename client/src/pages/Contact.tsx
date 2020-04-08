import React from 'react';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import { Label, Input, TextArea, Button } from '../styles/components';
import I18n from '../i18n';

export default function Contact() {
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
          <Input name="name" type="text"></Input>
          <Label>
            <I18n t="contact.email" />
          </Label>
          <Input name="email" type="email"></Input>
          <Label>
            <I18n t="contact.message" />
          </Label>
          <TextArea></TextArea>
          <Button type="submit">
            {' '}
            <I18n t="contact.submit" />
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
