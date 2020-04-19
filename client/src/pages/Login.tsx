import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { Title, Label, ErrorLabel, Input, Button } from '../styles/components';
import { Top, FormWrap, Form } from '../styles/form';
import Footer from '../components/Footer';
import { loginUser } from '../actions/actionCreators';
import { connect } from 'react-redux';
import SubmitButton from '../components/SubmitButton';

function Login(props: any) {
  const [form, setForm] = React.useState({ email: '', passphrase: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  let history = useHistory();

  function handleChange(evt: any) {
    evt.persist();
    if (submitting) setSubmitting(false);
    setForm(form => ({ ...form, [evt.target.name]: evt.target.value }));
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    setSubmitting(true);
    setError(null);
    props.loginUser(form);
  }

  useEffect(() => {
    setError('ERROR: INTENTAR DE NUEVO');
  }, [props.error]);

  useEffect(() => {
    if (props.user !== null) history.push('/');
  }, [props.user]);

  return (
    <>
      <Top>
        <Title>LOGIN</Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit}>
          <Label>USUARIO</Label>
          <Input
            name="email"
            onChange={handleChange}
            value={form && form.email}
            autoComplete="username"
          />
          <Label>CLAVE</Label>
          <Input
            name="passphrase"
            onChange={handleChange}
            value={form && form.passphrase}
            autoComplete="current-password"
            type="password"
          />
          <SubmitButton
            submitting={submitting}
            error={error}
            text="LOGIN"
            loadingText="LOGIN IN..."
          />
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user, error: reduxState.error };
}

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
