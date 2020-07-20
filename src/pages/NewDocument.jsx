// newProvider.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router';
import {
  Title,
  Label,
  TextArea,
  ProcessName,
  SubTit,
  Pad,
  Button,
} from '../styles/components';
import { Top, Form, FormWrap, ErrorForm } from '../styles/form';
import { useForm } from 'react-hook-form';
import Process from '../build/contracts/Process.json';
import { useDropzone } from 'react-dropzone';
import GoogleMap from '../components/GoogleMap';
import { hashFile } from '../utils/hashFile';
import { UserContext } from '../context/UserContext';
import TxTrack from '../components/TxTrack';
import { DropZone } from '../styles/newDocument';
import { useTranslation, Trans } from 'react-i18next';

function NewDocument() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const params = useParams();
  const [txHash, setTxHash] = useState(undefined);
  const [processDetails, setProcessDetails] = useState();
  const { register, handleSubmit, setValue, errors } = useForm();
  const [location, setLocation] = useState(undefined);
  const { account, web3, contract } = useContext(UserContext);

  const onDrop = useCallback(
    ([file]) => {
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
    },
    [setValue]
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
  }, [location, setValue]);

  useEffect(() => {
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
      let processContract = new web3.eth.Contract(Process.abi, params.process);

      processContract.methods
        .addDocument(
          data.name,
          data.hash,
          data.lat.toString(),
          data.lng.toString(),
          data.comment
        )
        .send({ from: account.address })
        .on('transactionHash', (txHash) => setTxHash(txHash));
    });
  }

  useEffect(() => {
    async function getProcessDetails() {
      let processContract = new web3.eth.Contract(Process.abi, params.process);
      const process = await processContract.methods
        .getDetails()
        .call({ from: account.address });
      process[0] = await contract.methods
        .getUser(process[0])
        .call({ from: account.address });

      setProcessDetails(process);
    }
    getProcessDetails();
    // eslint-disable-next-line
  }, [params]);

  return (
    <>
      <Top>
        <Title>
          <Trans>newDocument:title</Trans>
        </Title>
      </Top>
      <FormWrap>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {txHash ? (
            <TxTrack tx={txHash} />
          ) : (
            <>
              <Pad>
                {processDetails && (
                  <>
                    <SubTit>{t('newDocument:processTitle')}</SubTit>
                    <ProcessName>{processDetails[1]}</ProcessName>
                    <SubTit>{t('newDocument:supplier')}</SubTit>
                    <SubTit className="bold">{processDetails[0][2]}</SubTit>
                  </>
                )}
              </Pad>
              <Label>{t('newDocument:hashFile')}</Label>
              <DropZone {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p style={{ transform: 'translateY(55px)', margin: 0 }}>
                    {t('newDocument:dragFile')}
                  </p>
                ) : (
                  <pre style={{ transform: 'translateY(45px)', margin: 0 }}>
                    {hash
                      ? `${t('newDocument:fileName')} ${file.name}\n${t(
                          'newDocument:fileHash'
                        )} ${hash.substr(0, 8)}...${hash.substr(-8)}`
                      : t('newDocument:dropFile')}
                  </pre>
                )}
              </DropZone>
              <ErrorForm>{errors.file && errors.file.message}</ErrorForm>
              <Label>{t('newDocument:locationComment')}</Label>
              {location !== undefined && (
                <GoogleMap
                  draggable
                  setLocation={setLocation}
                  coords={location}
                />
              )}
              <Label>{t('newDocument:comments')}</Label>
              <TextArea name="comment" ref={register}></TextArea>
              <Button type="submit">{t('newDocument:submit')}</Button>
            </>
          )}
        </Form>
      </FormWrap>
    </>
  );
}

export default NewDocument;
