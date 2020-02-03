// newProvider.js
import React from 'react';
import styled from 'styled-components';
import { Title, Label, Input, TextArea, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';

function NewProvider() {
  return (
    <Wrap>
      <Top>
        <Title>
          NUEVO<br/>
          PROVEEDOR
        </Title>
      </Top>
      <FormWrap>
        <Form>
          <Label>
            NOMBRE
          </Label>
          <Input>
          </Input>
          <Label>
            DIRECCION
          </Label>
          <Input>
          </Input>
          <Label>
            CONTACTO DE REFERENCIA
          </Label>
          <Input>
          </Input>
          <Label>
            USUARIO
          </Label>
          <Input>
          </Input>
          <Label>
            GENERAR CLAVE
          </Label>
          <Input>
          </Input>
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
export default NewProvider;