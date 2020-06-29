import React from 'react';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col3 } from '../styles/tableComponents';
import Footer from '../components/Footer';

export default function DocumentList() {
  return (
    <>
      <Top>
        <Title>DOCUMENTOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col3>NOMBRE</Col3>
            <Col3>FECHA DE SUBIDA</Col3>
          </HeadRow>
          <Row>
            <Col3>name</Col3>
            <Col3>minetime</Col3>
          </Row>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
