import React, { useState, useContext } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  BottomSpace,
} from '../styles/webComponents';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';
import { Redirect } from 'react-router';

export default function Login() {
  const { drizzle, initialized } = useContext(DrizzleContext.Context);
  const state = drizzle.store.getState();
  const [isUser, user] = useAuth();

  if (initialized) {
    if (isUser === true) return <Redirect to="/" />;
    else
      return (
        <>
          <WebTop>
            <WidthContent>
              <WebTopTit>Login</WebTopTit>
            </WidthContent>
          </WebTop>
          <WidthContent>
            <p>No se puede loguear</p>
          </WidthContent>
          <BottomSpace />
          <Footer />
        </>
      );
  }
  return (
    <>
      <WebTop>
        <WidthContent>
          <WebTopTit style={{ paddingBottom: '150px' }}>
            Conectando a la Blockchain...
          </WebTopTit>
        </WidthContent>
      </WebTop>
      <Footer />
    </>
  );
}
