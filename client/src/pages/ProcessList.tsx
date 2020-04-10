// processes.js
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Title, Button } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as Pen } from '../img/pen.svg';
import Footer from '../components/Footer';
import useSWR from 'swr';

interface IProcess {
  processContracts: string;
  processName: string;
  supplierName: string;
}

export default function ProcessList() {
  const { data } = useSWR('/api/process/get', url =>
    axios({
      method: 'get',
      url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(result => result.data)
  );

  return (
    <>
      <Top>
        <Title>PROCESOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col4>NOMBRE</Col4>
            <Col4>PROVEEDOR</Col4>
            <Col4>VER DOC.</Col4>
            <Col4>AGREGAR DOC.</Col4>
            <Col4>CONTRACT</Col4>
          </HeadRow>
          {data?.map((process: IProcess) => (
            <Row key={process.processContracts}>
              <Col4>{process.processName}</Col4>
              <Col4>{process.supplierName}</Col4>
              <Col4>
                <Link to={'/documents/' + process.processContracts}>
                  <Eye />
                  VER DOC.
                </Link>
              </Col4>
              <Col4>
                <Link to={'/documents/add/' + process.processContracts}>
                  <Pen />
                  AGREGAR DOC.
                </Link>
              </Col4>
              <Col4>{process.processContracts}</Col4>
            </Row>
          ))}
          <Button as={Link} className="submit" to="/processes/add">
            NUEVO PROCESO
          </Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
