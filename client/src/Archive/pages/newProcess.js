// newProvider.js
import React from 'react';
import styled from 'styled-components';
import { Title, Label, Input, TextArea, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';

const ProvidersButton = styled(Button)`
  margin-top:20px;
`;

function NewProcess() {
  return (
    <Wrap>
      <Top>
        <Title>
          NUEVO<br/>
          PROCESO
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
            PROVEEDOR
          </Label>
          <Input>
          </Input>
          <ProvidersButton>
            LISTAR PROVEEDORES
          </ProvidersButton>
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
export default NewProcess;