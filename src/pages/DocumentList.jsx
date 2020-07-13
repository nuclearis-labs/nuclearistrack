import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { Title } from '../styles/components';
import { Top, FormWrap } from '../styles/form';
import Process from '../build/contracts/Process.json';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Table, HeadRow, Row, Col } from '../styles/documentList';

export default function DocumentList() {
  const params = useParams();
  const [documents, setDocuments] = useState([]);
  const { web3 } = useContext(UserContext);

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
      ).then((documents) => {
        console.log(documents);

        setDocuments(documents);
      });
    }
    getDocumentList();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Top>
        <Title>DOCUMENTOS</Title>
      </Top>
      <FormWrap>
        <Table>
          <thead>
            <HeadRow>
              <th>NOMBRE</th>
              <th>FECHA</th>
              <th>DETALLES</th>
            </HeadRow>
          </thead>
          <tbody>
            {documents.map((document) => (
              <Row key={document[4]}>
                <Col style={{ width: '50%' }}>{document[0]}</Col>
                <Col>
                  {new Date(parseInt(document[4] + '000')).toLocaleString()}
                </Col>
                <Col>
                  <Link to={'/documents/' + params.process + '/' + document[1]}>
                    VER
                  </Link>
                </Col>
              </Row>
            ))}
          </tbody>
        </Table>
      </FormWrap>
    </>
  );
}
