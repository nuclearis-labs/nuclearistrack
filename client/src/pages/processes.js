// processes.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { Row, HeadRow, Col4 } from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as Pen } from '../img/pen.svg';
import Footer from '../components/footer.js';
import Header from '../components/header.js';

function Processes() {
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>PROCESOS</Title>
        </Top>
        <FormWrap>
          <Form>
            <HeadRow>
              <Col4>NOMBRE</Col4>
              <Col4>PROVEEDOR</Col4>
              <Col4>DOCUMENTOS</Col4>
              <Col4></Col4>
            </HeadRow>
            <Row>
              <Col4>MATERIA PRIMA</Col4>
              <Col4>BGH</Col4>
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
            </Row>
            <Button as={Link} className="submit" to="/processes/add">
              NUEVO PROCESO
            </Button>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
export default Processes;
