import React, { useEffect } from 'react';
import axios from 'axios';
import { Title, Label, Button, Input, Select } from '../styles/components';
import Permits from '../components/Permits';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { connect } from 'react-redux';
import { getCurrentUser } from '../actions/actionCreators';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';

function NewUser(props: any) {
  const { register, handleSubmit, errors, setError, getValues } = useForm();
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  const history = useHistory();

  async function onSubmit() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/api/user/',
        data: getValues(),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.response.data));
    });
  }

  useEffect(() => {
    if (error !== null) {
      for (const key in error) {
        setError(key.replace('body.', ''), 'duplicate', error[key].message);
      }
    }
  }, [error]);

  useEffect(() => {
    if (value !== null) history.push('/users');
  }, [value]);

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(execute)}>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input
            type="text"
            ref={register({ required: 'This field is required' })}
            name="newUserName"
          ></Input>
          <ErrorForm>
            {errors.newUserName && errors.newUserName.message}
          </ErrorForm>
          <Label>
            <I18n t="forms.mail" />
          </Label>
          <Input
            type="email"
            ref={register({ required: 'This field is required' })}
            name="newUserEmail"
          ></Input>
          <ErrorForm>
            {errors.newUserEmail && errors.newUserEmail.message}
          </ErrorForm>
          <Label>PERMISOS</Label>
          <Select
            name="roles"
            multiple={true}
            ref={register({ required: 'This field is required' })}
          >
            <option>project:create</option>
            <option>project:read</option>
            <option>project:changeState</option>
            <option>process:read</option>
            <option>process:create</option>
            <option>process:assign</option>
            <option>document:create</option>
            <option>document:read</option>
            <option>documents:read</option>
            <option>admin:manageRoles</option>
            <option>admin:transfer</option>
          </Select>
          <ErrorForm>{errors.roles && errors.roles.message}</ErrorForm>
          <Button disabled={pending} type="submit">
            CREAR
          </Button>
        </Form>
      </FormWrap>
      )}
      <Footer />
    </>
  );
}

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user };
}

export default connect(
  mapStateToProps,
  { getCurrentUser }
)(NewUser);
