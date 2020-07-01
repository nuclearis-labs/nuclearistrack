// newProvider.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import styled, { keyframes } from 'styled-components';
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
import { DocumentSchema } from '../validationSchemas/index';
import LoggedHeader from '../components/LoggedHeader';
import useWeb3 from '../hooks/useWeb3';
import Process from '../build/contracts/Process.json';
import { useDropzone } from 'react-dropzone';
import GoogleMap from '../components/GoogleMap';
import RSKLink from '../components/RSKLink';
import { Link } from 'react-router-dom';

const fade = keyframes`
  from {
    box-shadow: none;
  }

  to {
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);

  }
`;

const DropZone = styled.div`
  height: 140px;
  width: 400px;
  padding: 0 22px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid grey;
  width: fit-content;
  min-width: 400px;
  &:hover {
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 1);
    animation: ${fade} 100ms linear;
  }
`;

function NewDocument() {
  const [web3, contract] = useWeb3();
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const params = useParams();
  const [txHash, setTxHash] = useState(undefined);
  const [processDetails, setProcessDetails] = useState({});
  const { register, handleSubmit, setValue, errors } = useForm();
  const [location, setLocation] = useState(undefined);

  const onDrop = useCallback(
    (acceptedFiles) => onFileChange(acceptedFiles),
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      .then(({ latitude, longitude }) => {
        setLocation({ lat: latitude, lng: longitude });
      })
      .catch((e) => setLocation(undefined));
  }, []);

  useEffect(() => {
    if (location) {
      setValue('lat', location.lat);
      setValue('lng', location.lng);
    }
  }, [location]);

  React.useEffect(() => {
    register('name');
    register('hash');
    register('lat');
    register('lng');
  }, [register]);

  function onSubmit(data) {
    return new Promise((resolve, reject) => {
      if (location === undefined) {
        reject('No location provided');
        return;
      }
      console.log(data);
      let processContract = new web3.eth.Contract(Process.abi, params.process);

      web3.eth.getCoinbase().then((msgSender) => {
        processContract.methods
          .addDocument(
            data.name,
            data.hash,
            web3.utils.asciiToHex(data.lat),
            web3.utils.asciiToHex(data.lng),
            data.comment
          )
          .send({ from: msgSender })
          .on('transactionHash', (txHash) => setTxHash(txHash));
      });
    });
  }

  async function hashFile(fileDescriptor) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileDescriptor);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return `0x${hashArray
      .map((b) => ('00' + b.toString(16)).slice(-2))
      .join('')}`;
  }

  function onFileChange([file]) {
    setFile(file);
    setValue('name', file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      hashFile(event.target.result).then((hash) => {
        setHash(hash);
        setValue('hash', hash);
      });
    };
    if (file) reader.readAsArrayBuffer(file);
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
          {txHash ? (
            <>
              <Label>EXITO</Label>
              <p>
                Transaccion fue enviada con exito a la Blockchain, puede tardar
                varios minutos en ser confirmada.
              </p>
              <div>
                Transaction Hash: <RSKLink hash={txHash} testnet type="tx" />
              </div>
              <Button as={Link} to={'/documents/' + params.process}>
                VER DOCUMENTOS
              </Button>
            </>
          ) : (
            <>
              <Pad>
                {web3 && processDetails && processDetails.hasOwnProperty('1') && (
                  <>
                    <SubTit>PROCESO</SubTit>
                    <ProcessName>
                      {web3.utils.hexToAscii(processDetails[1])}
                    </ProcessName>
                    <SubTit>PROVEEDOR</SubTit>
                    <SubTit className="bold">{processDetails[0]}</SubTit>
                  </>
                )}
              </Pad>
              <Label>SELLAR ARCHIVO</Label>
              <DropZone {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p style={{ transform: 'translateY(55px)', margin: 0 }}>
                    Deje el archivo aquí
                  </p>
                ) : (
                  <pre style={{ transform: 'translateY(45px)', margin: 0 }}>
                    {hash
                      ? `Nombre del archivo: ${
                          file.name
                        }\nHash del archivo: ${hash.substr(
                          0,
                          8
                        )}...${hash.substr(-8)}`
                      : `Arrastre el archivo hacia aquí,\no haga click para seleccionarlo`}
                  </pre>
                )}
              </DropZone>
              <ErrorForm>{errors.file && errors.file.message}</ErrorForm>
              <Label>UBICACION DEL DOCUMENTO (AJUSTAR SI NECESARIO)</Label>
              {location !== undefined && (
                <GoogleMap setLocation={setLocation} coords={location} />
              )}
              <Label>OBSERVACIONES</Label>
              <TextArea name="comment" ref={register}></TextArea>
              <Button type="submit">SELLAR</Button>
            </>
          )}
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}

export default NewDocument;
