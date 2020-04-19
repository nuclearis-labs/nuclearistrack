import React from 'react';
import axios from 'axios';
import { Title, Label, ErrorLabel, Input, Select } from '../styles/components';
import SubmitButton from '../components/SubmitButton';
import Permits from '../components/Permits';
import { Top, Form, FormWrap } from '../styles/form';
import Footer from '../components/Footer';
import I18n from '../i18n';
import { connect } from 'react-redux';
import { getCurrentUser } from '../actions/actionCreators';
import { useHistory } from 'react-router-dom';

function NewUser(props: any) {
  const [form, setForm] = React.useState<any>({ roles: [] });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);
  let history = useHistory();

  function handleChange(evt: any) {
    evt.persist();
    if (submitting) setSubmitting(false);
    if (evt.target.name === 'roles') {
      const options = Array.from(evt.target.selectedOptions).map(
        (option: any) => option.value
      );
      setForm((form: any) => ({
        ...form,
        [evt.target.name]: [...options]
      }));
    } else {
      setForm((form: any) => ({
        ...form,
        [evt.target.name]: evt.target.value
      }));
    }
  }

  function handleSubmit(evt: any) {
    evt.preventDefault();
    setSubmitting(true);
    setError(null);
    axios({
      method: 'post',
      url: '/api/user/',
      data: {
        ...form,
        email: props.user.userEmail
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(result => history.push('/users'))
      .catch(e => setError('ERROR: USUARIO YA EXISTE O REPETIR'));
  }

  return (
    <>
      <Top>
        <Title>
          <I18n t="forms.newUser" />
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit}>
          <Label>
            <I18n t="forms.name" />
          </Label>
          <Input type="text" onChange={handleChange} name="newUserName"></Input>
          <Label>
            <I18n t="forms.mail" />
          </Label>
          <Input
            type="email"
            onChange={handleChange}
            name="newUserEmail"
          ></Input>
          <Label>PERMISOS</Label>
          <Select name="roles" multiple={true} onChange={handleChange}>
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
          <SubmitButton
            submitting={submitting}
            error={error}
            text="CREAR"
            loadingText="CREANDO..."
          />
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
