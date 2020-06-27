import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col3, Col2 } from '../styles/tableComponents';
import Footer from '../components/Footer';

interface IDocument {
  name: string;
  docNumber: number;
  documentHash: string;
  mineTime: string;
}

export default function DocumentList() {
  const { process } = useParams();

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
