import React, { useState } from "react";
import { Header, Container, Form, Button } from "semantic-ui-react";

export default function Subir(props) {
  const [form, setForm] = useState({ titulo: "" });
  const [fileLoading, setFileLoading] = useState({ bool: false, progress: 0 });

  const style = {
    header: { marginTop: "10vh" },
    secondaryHeader: { marginTop: "5vh" },
    input: { margin: "auto" },
    button: { marginTop: "20px" },
    fileInput: {
      width: "0.1px",
      height: "0.1px",
      opacity: 0,
      overflow: "hidden",
      position: "absolute",
      zIndex: "-1"
    }
  };

  const handleChange = (e, input) => {
    e.persist();
    setForm(oldForm => ({ ...oldForm, titulo: input.value }));
  };

  const handleDocument = e => {
    e.persist();

    let reader = new FileReader();
    reader.onloadstart = e => {
      setFileLoading(input => ({ ...input, bool: true }));
    };
    reader.onprogress = e => {
      if (e.lengthComputable) {
        setFileLoading(input => ({
          ...input,
          progress: Math.round((e.loaded / e.total) * 100)
        }));
      }
    };

    reader.onload = e => {
      setFileLoading(input => ({ ...input, bool: false }));
    };
    reader.readAsBinaryString(e.target.files[0]);

    setForm(oldForm => ({ ...oldForm, file: e.target.files[0] }));
  };

  return (
    <Container textAlign="center" style={style.header}>
      <Header as="h1">Subir documento</Header>
      <Form>
        <Form.Field>
          <Form.Input
            style={style.input}
            value={form.titulo}
            name="titulo"
            placeholder="Nombre de archivo"
            onChange={handleChange}
          />
          <Button
            disabled={fileLoading.bool}
            as="label"
            style={style.input}
            htmlFor="upload"
          >
            {fileLoading.bool
              ? `${fileLoading.progress}%`
              : form.file
              ? `${form.file.name}   ${(form.file.size / 1000000).toFixed(
                  2
                )} MB`
              : "Cargar documento"}
            <input
              type="file"
              style={style.fileInput}
              name="file"
              id="upload"
              onChange={handleDocument}
            />
          </Button>
          <Button
            disabled={!form.file || !form.titulo || fileLoading.bool === true}
            style={style.button}
            primary
          >
            Subir a Blockchain
          </Button>
        </Form.Field>
      </Form>
    </Container>
  );
}
