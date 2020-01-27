// processes.js
import React from 'react';
import styled from 'styled-components';
import { Title, Button, Wrap } from '../components/components.js';
import { Top, FormWrap } from '../components/form.js';
import { Table, Row, HeadRow, Col3 } from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';

const DocTit = styled(Title)`
  font-size:16px;
  line-height:16px;
  margin:10px 0;
  color:#333;
  margin-top:25px;
`;

const ProcessName = styled.div`
  color:#333;
  font-weight:700;
  font-size:23px;
  letter-spacing:1px;
  margin-bottom:10px;
`;

const Label = styled.div`
  display:inline-block;
  color:#8c6239;
  font-size:13px;
  letter-spacing:1px;
  width:130px;
  &.bold{color:#333; font-weight:700;}
`;

const Pad = styled.div`
  width:700px;
  margin:0 auto;
  padding:20px 0;
`;

function EditProcess() {
  return (
    <Wrap>
      <Top>
        <Title>
          EDITAR<br/>
          PROCESO
        </Title>
      </Top>
      <FormWrap>
        <Pad>
          <Label>PROCESO</Label>
          <ProcessName>MATERIA PRIMA BARRA DE ACERO</ProcessName>
          <Label>PROVEEDOR</Label><Label className="bold">BGH</Label>
          <DocTit>DOCUMENTOS</DocTit>
          <HeadRow>
            <Col3>DESCRIPCION</Col3><Col3>DOCUMENTOS</Col3>
          </HeadRow>
          <Row>
              <Col3>PRUEBA RESISTENCIA AFRGS</Col3><Col3><a href=""><Eye />VER DOC.</a></Col3>
          </Row>
          <Row>
              <Col3>DENSIDAD ERFS</Col3><Col3><a href=""><Eye />VER DOC.</a></Col3>
          </Row>
          <Button>
            AGREGAR DOCUMENTO
          </Button>
        </Pad>
      </FormWrap>
    </Wrap>
  );
}
export default EditProcess;