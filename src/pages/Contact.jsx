import React, { useState } from 'react';
import styled from 'styled-components';
import { Form } from '../styles/form';
import Footer from '../components/Footer';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  BottomSpace,
} from '../styles/webComponents';
import { Label, Input, TextArea, Button } from '../styles/components';
import I18n from '../i18n';
import bg from '../img/bgHome.jpg';
import { useForm } from 'react-hook-form';

const WebTopContact = styled(WebTop)`
  height: 370px;
  background: url(${bg}) #1a1a1a no-repeat center;
`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const encode = (data) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      )
      .join('&');
  };

  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...form }),
    })
      .then(() => alert('Success!'))
      .catch((error) => alert(error));

    e.preventDefault();
  };

  return (
    <>
      <WebTopContact>
        <WidthContent>
          <WebTopTit>
            <I18n t="contact.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopContact>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        <Form onSubmit={handleSubmit}>
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
          <TextArea name="message"></TextArea>
          <Button type="submit">
            <I18n t="contact.submit" />
          </Button>
        </Form>
      </WidthContent>
      <BottomSpace />
      <Footer />
    </>
  );
}
