import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col3, Col2 } from '../styles/tableComponents';
import Footer from '../components/Footer';
import useSWR from 'swr';

interface IDocument {
  name: string;
  docNumber: number;
  documentHash: string;
  mineTime: string;
}

export default function DocumentList() {
  const { process } = useParams();
  const { data } = useSWR('/api/doc/get?contract=' + process, url =>
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(({ data }) => {
        return data.map((doc: IDocument) => {
          let date = new Date(parseInt(doc.mineTime) * 1000);
          doc.mineTime = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} +0${date.getTimezoneOffset() /
            60}:00`;
          return doc;
        });
      })
  );

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

          {data && data.length > 0 ? (
            data.map((doc: IDocument) => (
              <Row
                as={Link}
                to={`/documents/${process}/${doc.documentHash}`}
                key={doc.documentHash}
              >
                <Col3>{doc.name}</Col3>
                <Col3>{doc.mineTime}</Col3>
              </Row>
            ))
          ) : (
            <Row>
              <Col2>No hay documentos disponibles</Col2>
            </Row>
          )}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
