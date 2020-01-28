import React from 'react';
import Header from '../components/header.js';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer.js';

export default function FAQ() {
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>FAQ</Title>
        </Top>
      </Wrap>
      <Footer />
    </>
  );
}
