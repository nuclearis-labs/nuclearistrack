// processes.js
import React from 'react';
import styled from 'styled-components';
import { Title, Button, Wrap, DocTit, ProcessName, SubTit, Pad} from '../components/components.js';
import { Top, FormWrap } from '../components/form.js';
import { Table, Row, HeadRow, Col3 } from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';

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
          <SubTit>PROCESO</SubTit>
          <ProcessName>MATERIA PRIMA BARRA DE ACERO</ProcessName>
          <SubTit>PROVEEDOR</SubTit><SubTit className="bold">BGH</SubTit>
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