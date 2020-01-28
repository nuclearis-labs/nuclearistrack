// processes.js
import React from 'react';
import { Link } from "react-router-dom";
import { Title, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { Table, Row, HeadRow, Col4 } from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as Pen } from '../img/pen.svg';

function Processes() {
  return (
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
              <a href="">
                <Eye />
                VER DOC.
              </a>
            </Col4>
            <Col4>
              <a href="">
                <Pen />
                AGREGAR DOC.
              </a>
            </Col4>
          </Row>
          <Row>
            <Col4>MECANIZADO</Col4>
            <Col4>IMECO</Col4>
            <Col4>
              <a href="">
                <Eye />
                VER DOC.
              </a>
            </Col4>
            <Col4>
              <a href="">
                <Pen />
                AGREGAR DOC.
              </a>
            </Col4>
          </Row>
          <Row>
            <Col4>PLATEADO</Col4>
            <Col4>NRS</Col4>
            <Col4>
              <a href="">
                <Eye />
                VER DOC.
              </a>
            </Col4>
            <Col4>
              <a href="">
                <Pen />
                AGREGAR DOC.
              </a>
            </Col4>
          </Row>
          <Button as={Link} className="submit" to="/processes/add">NUEVO PROCESO</Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
export default Processes;
