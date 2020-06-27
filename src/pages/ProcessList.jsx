// processes.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Button } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as Pen } from '../img/pen.svg';
import Footer from '../components/Footer';

interface IProcess {
  processContracts: string;
  processName: string;
  supplierName: string;
  supplierAddress: string;
}

function ProcessList(props: any) {
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
          <Row>
            <Col4>name</Col4>
            <Col4>supplier</Col4>
            <Col4>
              <Link>
                <Eye />
                VER DOC.
              </Link>
            </Col4>

            <Col4>
              <Link>
                <Pen />
                AGREGAR DOC.
              </Link>
            </Col4>
            <Col4>Process Contracts</Col4>
          </Row>
          <Button>NUEVO PROCESO</Button>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}

export default ProcessList;
