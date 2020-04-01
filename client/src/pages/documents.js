import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Title } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { Row, HeadRow, Col3, Col6 } from '../components/tableComponents.js';
import Footer from '../components/footer.js';

export default function Document() {
  const [documents, setDocuments] = useState([]);
  const [, setIsLoading] = useState(true);
  const { process } = useParams();

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/doc/get?contract=' + process,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      let formattedData = data.map(doc => {
        let date = new Date(doc.mineTime * 1000);
        doc.mineTime = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} +0${date.getTimezoneOffset() /
          60}:00`;
        return doc;
      });
      setDocuments(formattedData);
      setIsLoading(false);
    });
  }, [process]);

  return (
    <>
      <Top>
        <Title>DOCUMENTOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col3>NOMBRE</Col3>
            <Col6>NUMERO</Col6>
            <Col3>FECHA DE SUBIDA</Col3>
          </HeadRow>

          {documents.map(doc => (
            <Row
              as={Link}
              to={`/documents/${process}/${doc.documentHash}`}
              key={doc.documentHash}
            >
              <Col3>{doc.name}</Col3>
              <Col6>{doc.docNumber}</Col6>
              <Col3>{doc.mineTime}</Col3>
            </Row>
          ))}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
