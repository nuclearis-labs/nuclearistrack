import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { Title } from '../styles/components';
import { Top } from '../styles/form';
import Process from '../contracts/artifacts/Process.json';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import {
  TableBody,
  TableWrap,
  CenteredCol,
  TableButton,
  Table,
  Row,
  HeadRowMonsterrat,
  Col,
} from '../styles/tableComponents';
import { getDocumentDetails, getProcessDetails } from '../utils/web3Helpers';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Loader } from '../img/puff.svg';

export default function DocumentList() {
  const { t } = useTranslation();
  const params = useParams();
  const [documents, setDocuments] = useState(undefined);
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
        <Title>{t('documentList:title')}</Title>
      </Top>
      <TableWrap>
        <Table>
          <HeadRowMonsterrat>
            <Col>{t('documentList:name')}</Col>
            <Col>{t('documentList:date')}</Col>
            <Col>{t('documentList:details')}</Col>
          </HeadRowMonsterrat>
          <TableBody>
            {documents === undefined ? (
              <tr
                style={{ width: '100%', margin: 'auto', textAlign: 'center' }}
              >
                <td colSpan="4">
                  <Loader />
                </td>
              </tr>
            ) : (
                <>
                  {documents.length === 0 ? (
                    <Row>
                      <CenteredCol colSpan="4">
                        {t('documentList:noItems')}
                      </CenteredCol>
                    </Row>
                  ) : (
                      documents.map((document) => (
                        <Row key={document[4]}>
                          <Col style={{ width: '50%' }}>{document[0]}</Col>
                          <Col>
                            {new Date(parseInt(document[4] + '000')).toLocaleString()}
                          </Col>
                          <Col>
                            <TableButton as={Link}
                              to={'/documents/' + params.process + '/' + document[1]}
                            >
                              {t('documentList:view')}
                            </TableButton>
                          </Col>
                        </Row>
                      ))
                    )} </>)}
          </TableBody>
        </Table>
      </TableWrap>
    </>
  );
}
