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
        <Title>USUARIOS</Title>
      </Top>
      <FormWrap>
        <Form>
          <HeadRow>
            <Col4>NOMBRE</Col4>
            <Col4>TIPO</Col4>
            <Col4>DIRECCION</Col4>
            <Col4>ESTADO</Col4>
          </HeadRow>
          <Row>
            <Col4>NA-SA</Col4>
            <Col4>Cliente</Col4>
            <Col4>0x429d603e0777a8f50086eca73f58f8663441a77d</Col4>
            <Col4>Activo</Col4>
          </Row>
          <Row>
            <Col4>BGH</Col4>
            <Col4>Proveedor</Col4>
            <Col4>0x2b591e99afe9f32eaa6214f7b7629768c40eeb39</Col4>
            <Col4>Activo</Col4>
          </Row>
          <Button as={Link} className="submit" to="/users/add">NUEVO USUARIO</Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
export default Processes;
