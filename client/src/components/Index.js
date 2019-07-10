import React from "react";
import { Container, Header } from "semantic-ui-react";

export default function Index(props) {
  const style = {
    header: { marginTop: "20vh" }
  };

  return (
    <Container textAlign="center" style={style.header}>
      <Header as="h1" style={style.header}>
        Primer plataforma descentralizada de trazabilidad con tecnologia
        Blockchain
      </Header>
    </Container>
  );
}
