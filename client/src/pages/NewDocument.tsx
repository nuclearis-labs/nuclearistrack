// newProvider.js
import React, { useState, useEffect } from 'react';
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
  Pad,
  PassphraseButton,
  PassphraseInput
} from '../styles/components';
import Spinner from '../components/Spinner';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import axios from 'axios';
import RSKLink from '../components/RSKLink';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import useSWR from 'swr';
import I18n from '../i18n';
import { RouteProps } from 'react-router';
import { GoogleMap } from '../components/GoogleMap';
import { getCurrentUser } from '../actions/actionCreators';
import { connect } from 'react-redux';
import { DocumentSchema } from '../validationSchemas/index';

function NewDocument(props: any) {
  const [loading, setLoading] = useState<any>(true);
  let { process } = useParams();
  const { register, handleSubmit, errors, getValues } = useForm({
    validationSchema: DocumentSchema
  });
  const [location, setLocation] = useState<any>();
  const { execute, pending, value, error } = useAsync(onSubmit, false);
  const { data } = useSWR('/api/process/getOne?contract=' + process, url =>
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(({ data }) => data)
  );
  useEffect(() => {
    function getLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(({ coords }) =>
            resolve(coords)
          );
        } else {
          reject(undefined);
        }
      });
    }
    getLocation()
      .then(coords => setLocation(coords))
      .catch(e => setLocation(undefined));
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [location]);

  function onSubmit() {
    return new Promise((resolve, reject) => {
      if (location == undefined) {
        reject('No location provided');
        return;
      }

      const form = getValues();

      let data = new FormData();
      data.append('file', form.file[0]);
      data.append('passphrase', form.passphrase);
      data.append('comment', form.comment);
      data.append('latitude', location.latitude.toString());
      data.append('longitude', location.longitude.toString());

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
        .catch(e => reject(e.response.data));
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
      {value ? (
        <Confirmation hash={value} />
      ) : (
        <FormWrap>
          {loading === false && (
            <Form onSubmit={handleSubmit(execute)}>
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
              <FileInput ref={register} name="file" type="file" />
              <ErrorForm>{errors.file && errors.file.message}</ErrorForm>
              <Label>UBICACION DEL DOCUMENTO</Label>
              {location && <GoogleMap coords={location} />}
              <Label>OBSERVACIONES</Label>
              <TextArea name="comment" ref={register}></TextArea>
              <div>
                <PassphraseInput
                  placeholder="Ingresar clave"
                  type="password"
                  name="passphrase"
                  ref={register}
                ></PassphraseInput>
                <PassphraseButton disabled={pending} type="submit">
                  {pending ? <Spinner color="white" size="sm" /> : 'CREAR'}
                </PassphraseButton>
                <ErrorForm>
                  {errors.passphrase && errors.passphrase.message}
                  {error &&
                    'Could not upload document: ' + error.error.substr(59 + 7)}
                </ErrorForm>
              </div>
            </Form>
          )}
        </FormWrap>
      )}
      <Footer />
    </>
  );
}

function Confirmation(props: any) {
  return (
    <FormWrap>
      <Form>
        <p>El documento fue subido con exito!</p>
        <p>
          Transaction: <RSKLink hash={props.hash} type="tx" testnet />
        </p>
        <Button as={Link} to="/">
          CONTINUAR
        </Button>
      </Form>
    </FormWrap>
  );
}

function mapStateToProps(reduxState: any) {
  return { user: reduxState.user };
}

export default connect(
  mapStateToProps,
  { getCurrentUser }
)(NewDocument);
