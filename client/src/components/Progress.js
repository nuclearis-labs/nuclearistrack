import React from "react";
import { Container, Header, Step } from "semantic-ui-react";

export default function Progress(props) {
  return (
    <Container textAlign="center">
      <Header>Avance de archivo</Header>
      <Step.Group ordered>
        <Step completed>
          <Step.Content>
            <Step.Title>Subida de archivo</Step.Title>
            <Step.Description>
              El archivo fue subido al sistema
            </Step.Description>
          </Step.Content>
        </Step>
        <Step>
          <Step.Content>
            <Step.Title>La transacción fue realizada</Step.Title>
            <Step.Description>
              La huella del archivo fue guardado en una transacción
            </Step.Description>
          </Step.Content>
        </Step>
        <Step>
          <Step.Content>
            <Step.Title>Guardado en bloque de Blockchain</Step.Title>
            <Step.Description>
              La transacción fue guardado en un bloque de la Blockchain
            </Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
    </Container>
  );
}
