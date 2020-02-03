// newProvider.js
import React from 'react';
import styled from 'styled-components';
import { Title, Label, Input, TextArea, Button, Wrap, ProcessName, SubTit, Pad } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';

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
            <Input>
            </Input>
            <Label>
              UBICACION DEL DOCUMENTO
            </Label>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2511.1929527537573!2d13.637685515546522!3d50.9941064559235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4709c4c691e03c3b%3A0x38abd8c993dfc69b!2sBGH%20Edelstahl%20Freital%20GmbH!5e0!3m2!1ses!2sar!4v1580330120217!5m2!1ses!2sar" width="355" height="250" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
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