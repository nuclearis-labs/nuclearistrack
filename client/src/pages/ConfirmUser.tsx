// newProvider.js
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Title, Label, Input, Button, ErrorLabel } from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import SubmitButton from '../components/SubmitButton';
import { Link } from 'react-router-dom';
import RSKLink from '../components/RSKLink';
import Footer from '../components/Footer';
import { useHistory } from 'react-router-dom';

export default function ConfirmUser() {
  const { id } = useParams();
  const [form, setForm] = React.useState<any>();
  const [result, setResult] = React.useState<any>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  let history = useHistory();

  function handleChange(evt: any) {
    evt.persist();
    if (submitting) setSubmitting(false);
    setForm((form: any) => ({
      ...form,
      [evt.target.name]: evt.target.value
    }));
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    setSubmitting(true);
    setError(null);
    axios({
      method: 'post',
      url: `/api/user/confirm/${id}`,
      data: {
        ...form
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        localStorage.setItem('pendingTx', `[${data.txHash}]`);
        setResult(data);
      })
      .catch(e => setError('ERROR: NO SE LOGRO CONFIRMAR EL USUARIO'));
  }

  return (
    <>
      <Top>
        <Title>
          CONFIRM
          <br />
          USER
        </Title>
      </Top>
      {result ? (
        <Confirmation {...result} />
      ) : (
        <FormWrap>
          <Form onSubmit={handleSubmit}>
            <Label>PASSPHRASE</Label>
            <Input type="password" onChange={handleChange} name="passphrase" />
            <Label>CONFIRM PASSPHRASE</Label>
            <Input
              type="password"
              onChange={handleChange}
              name="confirm_passphrase"
            />
            <SubmitButton
              submitting={submitting}
              error={error}
              text="CONFIRMAR"
              loadingText="CONFIRMANDO...."
            />
          </Form>
        </FormWrap>
      )}
      <Footer />
    </>
  );
}

function Confirmation(props: any) {
  debugger;
  return (
    <FormWrap>
      <Form>
        <p>Su cuenta fue creada con exito!</p>
        <ul>
          <li>Nombre: {props.username}</li>
          <li>Correo electronico: {props.email}</li>
          <li>Clave Mnemonica: {props.mnemonic}</li>
          <li>Dirección: {props.address}</li>
          <li>
            Transaction: <RSKLink hash={props.txHash} type="tx" testnet />
          </li>
        </ul>
        <p>
          Les sugerimos de anotar en un medio seguro la clave mnemonica, ya que
          es la unica forma de recuperar su cuenta en caso de que se olvide la
          clave ingresada.
        </p>
        <Button as={Link} to="/">
          CONTINUAR
        </Button>
      </Form>
    </FormWrap>
  );
}
