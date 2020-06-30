// newProvider.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Title,
  Label,
  FileInput,
  TextArea,
  ProcessName,
  SubTit,
  Pad,
  Button,
} from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { GoogleMap } from '../components/GoogleMap';
import { DocumentSchema } from '../validationSchemas/index';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';

function NewDocument() {
  const [web3, contract] = useWeb3();
  const params = useParams();
  const [processDetails, setProcessDetails] = useState({});
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

  function onSubmit(data) {
    return new Promise((resolve, reject) => {
      if (location === undefined) {
        reject('No location provided');
        return;
      }
    });
  }

  useEffect(() => {
    async function getProcessDetails() {
      let processContract = new web3.eth.Contract(Process.abi, params.process);

      const msgSender = await web3.eth.getCoinbase();
      const process = await processContract.methods
        .getDetails()
        .call({ from: msgSender });
      setProcessDetails(process);
    }
    if (web3) getProcessDetails();
  }, [web3, params]);

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
        <Form onSubmit={handleSubmit(onSubmit)}>
          {web3 && processDetails && processDetails.hasOwnProperty('1') && (
            <Pad>
              <SubTit>PROCESO</SubTit>
              <ProcessName>
                {web3.utils.hexToAscii(processDetails[1])}
              </ProcessName>
              <SubTit>PROVEEDOR</SubTit>
              <SubTit className="bold">{processDetails[0]}</SubTit>
            </Pad>
          )}
          <Label>SELLAR ARCHIVO</Label>
          <FileInput ref={register} name="file" type="file" />
          <ErrorForm>{errors.file && errors.file.message}</ErrorForm>
          <Label>UBICACION DEL DOCUMENTO</Label>
          {location && <GoogleMap coords={location} />}
          <Label>OBSERVACIONES</Label>
          <TextArea name="comment" ref={register}></TextArea>
          <Button type="submit">SELLAR</Button>
        </Form>
      </FormWrap>

      <Footer />
    </>
  );
}

export default NewDocument;
