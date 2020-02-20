// newProvider.js
import React from 'react';
import styled from 'styled-components';
import { Title, Label, Input, TextArea, Button, Wrap, ProcessName, SubTit, Pad } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { ReactComponent as Magni } from '../img/magni.svg';

const MapRect = styled.div`
  width:370px;
  height:250px;
  background:#aaa;
`;

const MagniWrap = styled.a`
  svg {
    width:30px;
    vertical-align:middle;
    margin-left:10px;
  }
`;

function NewDoc() {
  return (
    <Wrap>
      <Top>
        <Title>
          NUEVO<br/>
          DOCUMENTO
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Pad>
            <SubTit>PROCESO</SubTit>
            <ProcessName>MATERIA PRIMA BARRA DE ACERO</ProcessName>
            <SubTit>PROVEEDOR</SubTit><SubTit className="bold">BGH</SubTit>
           </Pad>
            <Label>
              DESCRIPCION DEL DOCUMENTO
            </Label>
            <Input>
            </Input>
            <Label>
              SELECCIONAR ARCHIVO
            </Label>
            <Input className="upload">
            </Input><MagniWrap href="#"><Magni/></MagniWrap>
            <Label>
              UBICACION DEL DOCUMENTO
            </Label>
            <MapRect>
            </MapRect>
            <Label>
              OBSERVACIONES
            </Label>
            <TextArea>
            </TextArea>
            <Button className="submit">
              CREAR
            </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
export default NewDoc;