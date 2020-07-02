import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { Title } from '../styles/components';
import { Top, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';
import LoggedHeader from '../components/LoggedHeader';
import { Link } from 'react-router-dom';

const Table = styled.table`
  width: 50%;
  margin: auto;
`;

export const Row = styled.tr`
  padding: 1px 0;
  box-sizing: border-box;
  font-size: 13px;
  letter-spacing: 0.5px;
  color: #333;
  cursor: pointer;
  &.active {
    font-weight: 700;
  }
`;

export const HeadRow = styled(Row)`
  color: #8c6239;
  font-weight: 700;
  padding: 4px 0;
`;

export const Col = styled.td`
  font-weight: 700;
`;

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
      ).then((documents) => {
        console.log(documents);

        setDocuments(documents);
      });
    }
    if (web3) getDocumentList();
    // eslint-disable-next-line
  }, [web3]);

  return (
    <>
      <LoggedHeader />
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
      <Footer />
    </>
  );
}
