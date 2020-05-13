// newProvider.js
import React, { useState, useEffect } from 'react';
import { useNavLocation } from '../hooks/useNavLocation';
import { useParams } from 'react-router-dom';
import {
  Title,
  Label,
  Input,
  FileInput,
  TextArea,
  Button,
  ProcessName,
  SubTit,
  Pad
} from '../styles/components';
import { Top, Form, FormWrap } from '../styles/form';
import axios from 'axios';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import useSWR from 'swr';
import I18n from '../i18n';
import { RouteProps } from 'react-router';
import { GoogleMap } from '../components/GoogleMap';
import { getCurrentUser } from '../actions/actionCreators';
import { connect } from 'react-redux';

function NewDocument(props: any) {
  let { process } = useParams();
  const { register, handleSubmit, errors, getValues } = useForm();
  const [form, setForm] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Coordinates | undefined>();
  const { execute, pending } = useAsync(onSubmit, false);
  const { data } = useSWR('/api/process/getOne?contract=' + process, url =>
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(({ data }) => data)
  );
  useNavLocation().then(coords => setLocation(coords));

  function handleChange(evt: any) {
    evt.persist();
    setForm((form: any) => ({
      ...form,
      [evt.target.name]: evt.target.value
    }));
  }
  function handleFileInput(evt: any) {
    evt.persist();
    setForm((form: any) => ({
      ...form,
      [evt.target.name]: evt.target.files[0]
    }));
  }

  useEffect(() => {
    setLoading(false);
  }, [location]);

  function onSubmit() {
    return new Promise((resolve, reject) => {
      if (location == undefined) {
        reject('No location provided');
        return;
      }

      let data = new FormData();
      data.append('file', form.file);
      data.append('email', props.user.userEmail);
      data.append('passphrase', form.passphrase);
      data.append('comment', form.comment);
      data.append('latitude', location.latitude.toString());
      data.append('longitude', location.longitude.toString());
      console.log(data);

      axios({
        method: 'post',
        url: '/api/doc/upload?contract=' + process,
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'content-type': 'multipart/form-data'
        }
      })
        .then(({ data }) => resolve(data))
        .catch(e => reject(e.message));
    });
  }

  return (
    <>
      <Top>
        <Title>
          NUEVO
          <br />
          DOCUMENTO
        </Title>
      </Top>
      <FormWrap>
        {loading === false ? (
          <Form>
            <Pad>
              <SubTit>PROCESO</SubTit>
              <ProcessName>
                {data && data.processName && data.processName.toUpperCase()}
              </ProcessName>
              <SubTit>PROVEEDOR</SubTit>
              <SubTit className="bold">
                {data && data.supplierName && data.supplierName.toUpperCase()}
              </SubTit>
            </Pad>
            <Label>SELECCIONAR ARCHIVO</Label>
            <FileInput
              ref={register({ required: true })}
              name="file"
              error={errors.file}
              type="file"
              onChange={handleFileInput}
            ></FileInput>
            <Label>UBICACION DEL DOCUMENTO</Label>
            {location && <GoogleMap coords={location} />}
            <Label>OBSERVACIONES</Label>
            <TextArea name="comment" onChange={handleChange}></TextArea>
            <div>
              <Input
                placeholder="ingresar clave"
                type="password"
                style={{
                  width: '100px',
                  position: 'relative',
                  top: '60px',
                  marginRight: '5px'
                }}
                name="passphrase"
                onChange={handleChange}
              ></Input>
              <Button
                style={{ display: 'inline-block', position: 'relative' }}
                onClick={handleSubmit(execute)}
                disabled={pending}
                className="submit"
              >
                {!pending ? <I18n t="forms.create" /> : 'LOADING'}
              </Button>
            </div>
          </Form>
        ) : (
          <h2>Loading</h2>
        )}
      </FormWrap>
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
)(NewDocument);
