import React, { useState, useEffect, Fragment } from "react";
import {
  Header,
  Container,
  Table,
  Icon,
  Pagination,
  Step,
  Button,
  Form
} from "semantic-ui-react";

const data = [
  {
    titulo: "Protocolo de control",
    fecha: "19/06/2019 16:13",
    subida: true,
    transaccion: true,
    guardado: false
  },
  {
    titulo: "Certificado Materia Prima",
    fecha: "18/06/2019 14:34",
    subida: true,
    transaccion: false,
    guardado: false
  },
  {
    titulo: "Certificado",
    fecha: "18/06/2019 11:32",
    subida: false,
    transaccion: false,
    guardado: false
  }
];

export default function Subir(props) {
  const [details, showDetails] = useState({ bool: false });
  const style = {
    header: { marginTop: "10vh" },
    secondaryHeader: { marginTop: "5vh" },
    input: { width: "30vw", margin: "auto" },
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

  function toggleDetails(e, m) {
    showDetails(toggle => ({ bool: !toggle.bool, id: m.titulo }));
  }

  useEffect(() => {
    console.log(details);
  }, [details]);

  return (
    <Container textAlign="center" style={style.header}>
      <Header as="h1">Listado de documentos</Header>
      <Form>
        <Form.Group>
          <Form.Input placeholder="Busqueda.." width={13} />
          <Form.Button width={3}>Resetear filtro</Form.Button>
        </Form.Group>
      </Form>
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Titulo de documento</Table.HeaderCell>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map(m => (
            <Fragment>
              <Table.Row
                onClick={e => {
                  toggleDetails(e, m);
                }}
              >
                <Table.Cell>{m.titulo}</Table.Cell>
                <Table.Cell>{m.fecha}</Table.Cell>
              </Table.Row>
              {details.bool && m.titulo === details.id && (
                <Table.Row>
                  <Table.Cell colSpan="2">
                    <Step.Group
                      items={[
                        {
                          completed: m.subida,
                          title: "Subida de archivo",
                          description: "El archivo fue subido al sistema"
                        },
                        {
                          completed: m.transaccion,
                          title: "La transacción fue realizada",
                          description:
                            "La huella del archivo fue guardado en una transacción"
                        },
                        {
                          active: m.guardado,
                          title: "Guardado en bloque de Blockchain",
                          description:
                            "La transacción fue guardado en un bloque de la Blockchain"
                        }
                      ]}
                      fluid
                      ordered
                    />
                  </Table.Cell>
                </Table.Row>
              )}
            </Fragment>
          ))}
        </Table.Body>
      </Table>
      <Pagination defaultActivePage={1} totalPages={1} />
    </Container>
  );
}
