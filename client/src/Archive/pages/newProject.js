// newProvider.js
import React from 'react';
import styled from 'styled-components';
import { Title, Label, Input, TextArea, Button, Wrap, Checkbox, Datepicker } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';

function NewProject() {
  return (
    <Wrap>
      <Top>
        <Title>
          NUEVO<br/>
          PROYECTO
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
            CLIENTE
          </Label>
          <Input>
          </Input>
          <Label>
            EXPEDIENTE
          </Label>
          <Input>
          </Input>
          <Label>
            FECHA DE APROBACIÓN
          </Label>
          <Datepicker>
          </Datepicker>
          <Checkbox></Checkbox><Label for="Checkbox"><span></span>FECHA DE HOY</Label>
          <Label>
            Nº OC
          </Label>
          <Input>
          </Input>
          <Label>
            CONTRATO
          </Label>
          <Input>
          </Input>
          <Button className="submit">
            CREAR
          </Button>
        </Form>
      </FormWrap>
    </Wrap>
  );
}
export default NewProject;