// newProvider.js
import React, { useState, useEffect } from 'react';
import {
  Title,
  Label,
  FileInput,
  TextArea,
  ProcessName,
  SubTit,
  Pad,
} from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { GoogleMap } from '../components/GoogleMap';
import { DocumentSchema } from '../validationSchemas/index';
import LoggedHeader from '../components/LoggedHeader';

function NewDocument(props) {
  const [loading, setLoading] = useState(true);
  // let { process } = useParams();
  const { register, handleSubmit, errors } = useForm({
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

  function onSubmit(data) {
    return new Promise((resolve, reject) => {
      if (location === undefined) {
        reject('No location provided');
        return;
      }
    });
  }

  return (
    <>
      <LoggedHeader />
      <Top>
        <Title>
          NUEVO
          <br />
          DOCUMENTO
        </Title>
      </Top>
      <FormWrap>
        {loading === false && (
          <Form onSubmit={handleSubmit(onSubmit)}>
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

      <Footer />
    </>
  );
}

export default NewDocument;
