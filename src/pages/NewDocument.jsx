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
  PassphraseInput,
} from '../styles/components';
import Spinner from '../components/Spinner';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import RSKLink from '../components/RSKLink';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import I18n from '../i18n';
import { RouteProps } from 'react-router';
import { GoogleMap } from '../components/GoogleMap';
import { DocumentSchema } from '../validationSchemas/index';

function NewDocument(props) {
  const [loading, setLoading] = useState(true);
  let { process } = useParams();
  const { register, handleSubmit, errors, getValues } = useForm({
    validationSchema: DocumentSchema,
  });
  const [location, setLocation] = useState();
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
      .then((coords) => setLocation(coords))
      .catch((e) => setLocation(undefined));
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
        {loading === false && (
          <Form /* onSubmit */>
            <Pad>
              <SubTit>PROCESO</SubTit>
              <ProcessName></ProcessName>
              <SubTit>PROVEEDOR</SubTit>
              <SubTit className="bold"></SubTit>
            </Pad>
            <Label>SELECCIONAR ARCHIVO</Label>
            <FileInput ref={register} name="file" type="file" />
            <ErrorForm>{errors.file && errors.file.message}</ErrorForm>
            <Label>UBICACION DEL DOCUMENTO</Label>
            {location && <GoogleMap coords={location} />}
            <Label>OBSERVACIONES</Label>
            <TextArea name="comment" ref={register}></TextArea>
          </Form>
        )}
      </FormWrap>
      )}
      <Footer />
    </>
  );
}

function Confirmation(props) {
  return (
    <FormWrap>
      <Form>
        <p>El documento fue subido con exito!</p>
        <p>
          Transaction: <RSKLink hash={props.hash} type="tx" testnet />
        </p>
        <Button>CONTINUAR</Button>
      </Form>
    </FormWrap>
  );
}

export default NewDocument;
