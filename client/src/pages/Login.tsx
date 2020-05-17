import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Title, Label, Input, Button } from '../styles/components';
import { Top, FormWrap, Form, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { loginUser } from '../actions/actionCreators';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';

function Login(props: any) {
  const { register, handleSubmit, errors, setError, getValues } = useForm();
  const { execute, pending, value, error } = useAsync(
    async () => props.loginUser(getValues()),
    false
  );
  const history = useHistory();

  useEffect(() => {
    if (props.user !== null) history.push('/');
  }, [props.user]);

  return (
    <>
      <Top>
        <Title>LOGIN</Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(execute)}>
          <Label>USUARIO</Label>
          <Input
            name="email"
            ref={register({ required: 'This field is required' })}
            autoComplete="username"
          />
          <ErrorForm>{errors.email && errors.email.message}</ErrorForm>
          <Label>CLAVE</Label>
          <Input
            name="passphrase"
            ref={register({ required: 'This field is required' })}
            autoComplete="current-password"
            type="password"
          />
          <ErrorForm>
            {errors.passphrase && errors.passphrase.message}
          </ErrorForm>
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : 'LOGIN'}
          </Button>
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
