import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Title } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col3 } from '../styles/tableComponents';
import Footer from '../components/Footer';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';
import LoggedHeader from '../components/LoggedHeader';

export default function DocumentList() {
  const [web3] = useWeb3();
  const params = useParams();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function getDocumentList() {
      let processContract = new web3.eth.Contract(Process.abi, params.process);

      const msgSender = await web3.eth.getCoinbase();
      const documents = await processContract.methods
        .getDetails()
        .call({ from: msgSender });

      Promise.all(
        documents[2].map((document) =>
          processContract.methods
            .getDocument(document)
            .call({ from: msgSender })
        )
      ).then((documents) => setDocuments(documents));
    }
    if (web3) getDocumentList();
  }, [web3]);

  return (
    <>
      <LoggedHeader />
      <Top>
        <Title>DOCUMENTOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col3>NOMBRE</Col3>
            <Col3>FECHA DE SUBIDA</Col3>
          </HeadRow>
          {documents.map((document) => (
            <Row>
              <Col3>{document[0]}</Col3>
              <Col3>{document[4]}</Col3>
            </Row>
          ))}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
