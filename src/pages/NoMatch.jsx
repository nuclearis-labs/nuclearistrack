import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { useTranslation } from 'react-i18next';

export default function NoMatch() {
  const { t } = useTranslation();

  return (
    <>
      <Top>
        <Title>{t('general:404Title')}</Title>
      </Top>
      <FormWrap>
        <Form>
          <p>{t('general:404')}</p>
          <ul>
            <li>
              <Link to="/">{t('header:home')}</Link>
            </li>
            <li>
              <Link to="/login">{t('header:login')}</Link>
            </li>
          </ul>
        </Form>
      </FormWrap>
    </>
  );
}
