import React from 'react';
import Header from '../components/header';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer';
import {
  NavPhraseFixed,
  WebTop,
  WidthContent,
  WebTopTit,
  ItemTit,
  ItemDesc,
  BottomSpace
} from '../components/webComponents.js';
import {
  Label,
  Input,
  FileInput,
  TextArea,
  Button,
  ProcessName,
  SubTit,
  Pad
} from '../components/components.js';
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
