import React, { useState } from "react";
import { Header, Container, Form, Button } from "semantic-ui-react";

export default function Subir(props) {
  const [form, setForm] = useState({ username: "", password: "" });

  const style = {
    header: { marginTop: "10vh" },
    secondaryHeader: { marginTop: "5vh" },
    input: { width: "30vw", margin: "auto" },
    button: { marginTop: "20px" }
  };

  const handleChange = (e, input) => {
    e.persist();
    setForm(oldForm => ({ ...oldForm, [input.name]: input.value }));
    console.log(form);
  };

  return (
    <Container textAlign="center" style={style.header}>
      <Header as="h1">Acceder</Header>
      <Form>
        <Form.Field>
          <Form.Input
            type="text"
            style={style.input}
            value={form.username}
            name="username"
            placeholder="Nombre de usuario"
            onChange={handleChange}
          />
          <Form.Input
            type="password"
            style={style.input}
            value={form.password}
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />

          <Button
            disabled={!form.username || !form.password}
            style={style.button}
            primary
          >
            Acceder
          </Button>
        </Form.Field>
      </Form>
    </Container>
  );
}
