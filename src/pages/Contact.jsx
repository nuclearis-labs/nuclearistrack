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

const WebTopContact = styled(WebTop)`
  height: 370px;
  background: url(${bg}) #1a1a1a no-repeat center;
`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const encode = (data) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      )
      .join('&');
  };

  const handleChange = (e) => {
    e.persist();
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.name.length === 0 ||
      form.email.length === 0 ||
      form.message.length === 0
    ) {
      setError(true);
      return;
    }
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...form }),
    })
      .then(() => setSuccess(true))
      .catch((error) => setError(true));
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
        {success ? (
          <div style={{ marginTop: '100px' }}>
            Se envío exitosamente su consulta
          </div>
        ) : error ? (
          <>
            <div style={{ marginTop: '100px' }}>
              Hubo un error enviando su consulta
            </div>
            <Button onClick={() => setError(false)}>Volver a intentar</Button>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Label>
              <I18n t="contact.name" />
            </Label>
            <Input name="name" onChange={handleChange} type="text"></Input>
            <Label>
              <I18n t="contact.email" />
            </Label>
            <Input name="email" onChange={handleChange} type="email"></Input>
            <Label>
              <I18n t="contact.message" />
            </Label>
            <TextArea name="message" onChange={handleChange}></TextArea>
            <Button type="submit">
              <I18n t="contact.submit" />
            </Button>
          </Form>
        )}
      </WidthContent>
      <BottomSpace />
      <Footer />
    </>
  );
}
