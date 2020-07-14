import React, { useState } from 'react';
import styled from 'styled-components';
import { Form } from '../styles/form';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  BottomSpace,
} from '../styles/webComponents';
import { Label, Input, TextArea, Button } from '../styles/components';
import bg from '../img/bgHome.jpg';
import { useTranslation } from 'react-i18next';

const WebTopContact = styled(WebTop)`
  height: 370px;
  background: url(${bg}) #1a1a1a no-repeat center;
`;

export default function Contact() {
  const { t } = useTranslation();
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
          <WebTopTit>{t('contact:bannerTitle')}</WebTopTit>
        </WidthContent>
      </WebTopContact>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        {success ? (
          <div style={{ marginTop: '100px' }}>{t('contact:success')}</div>
        ) : error ? (
          <>
            <div style={{ marginTop: '100px' }}>{t('contact:error')}</div>
            <Button onClick={() => setError(false)}>
              {t('contact:retry')}
            </Button>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Label>{t('contact:name')}</Label>
            <Input name="name" onChange={handleChange} type="text"></Input>
            <Label>{t('contact:email')}</Label>
            <Input name="email" onChange={handleChange} type="email"></Input>
            <Label>{t('contact:message')}</Label>
            <TextArea name="message" onChange={handleChange}></TextArea>
            <Button type="submit">{t('contact:submit')}</Button>
          </Form>
        )}
      </WidthContent>
      <BottomSpace />
    </>
  );
}
