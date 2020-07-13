import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { Title } from '../styles/components';
import { Top, FormWrap } from '../styles/form';
import Process from '../build/contracts/Process.json';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Table, HeadRow, Row, Col } from '../styles/documentList';
import { getDocumentDetails, getProcessDetails } from '../utils/web3Helpers';

export default function DocumentList() {
  const params = useParams();
  const [documents, setDocuments] = useState([]);
  const { web3, account } = useContext(UserContext);

  useEffect(() => {
    let processContract = new web3.eth.Contract(Process.abi, params.process);
    getProcessDetails(account.address, web3)([params.process])
      .then(getDocumentDetails(account.address, processContract))
      .then(setDocuments);

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
