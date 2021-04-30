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
import Process from '../artifacts/contracts/Process.sol/Process.json';
import { useDropzone } from 'react-dropzone';
import GoogleMap from '../components/GoogleMap';
import { hashFile } from '../utils/hashFile';
import { UserContext } from '../context/UserContext';
import { DropZone } from '../styles/newDocument';
import { useTranslation, Trans } from 'react-i18next';

function NewDocument() {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const params = useParams();
  const [txHash, setTxHash] = useState([]);
  const [processDetails, setProcessDetails] = useState();
  const { register, handleSubmit, setValue, errors } = useForm();
  const [location, setLocation] = useState(undefined);
  const { account, web3, contract } = useContext(UserContext);

  const onDrop = useCallback(
    (files) => {
      const uploadFiles = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            hashFile(event.target.result).then((hash) => {
              resolve({ name: file.name, hash });
            });
          };
          reader.readAsArrayBuffer(file);
        });
      });
      Promise.all(uploadFiles).then((files) => {
        setValue('files', files);
        setFiles(files);
      });
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  useEffect(() => {
    function getLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              setDisabled(false);
              resolve(coords);
            },
            () => setDisabled(true)
          );
        } else {
          setDisabled(true);
          reject(undefined);
        }
      });
    }
    getLocation()
      .then(({ latitude, longitude }) => {
        if (account.address === '0x495451b82A82d65219471FEFE5aabE24763ADA55') {
          setLocation({ lat: -34.55483534822142, lng: -58.51560983880614 });
        } else {
          setLocation({ lat: latitude, lng: longitude });
          setDisabled(false);
        }
      })
      .catch((e) => {
        setDisabled(false);
        setLocation(undefined);
      });
  }, [account]);

  useEffect(() => {
    if (location) {
      setValue('lat', location.lat);
      setValue('lng', location.lng);
    }
  }, [location, setValue]);

  useEffect(() => {
    register('files');
    register('lat');
    register('lng');
  }, [register]);

  async function onSubmit(data) {
    if (location === undefined) {
      setDisabled(true);
      return;
    }
    let processContract = new web3.eth.Contract(Process.abi, params.process);

    for (const file of data.files) {
      processContract.methods
        .addDocument(
          file.name,
          file.hash,
          data.lat.toString(),
          data.lng.toString(),
          data.comment
        )
        .send({ from: account.address })
        .on('transactionHash', (txHash) =>
          setTxHash((prevHash) => [...prevHash, txHash])
        );
    }
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
          {txHash.length > 0 ? (
            <>
              <p>{txHash.length} documentos enviados</p>
              Se enviaron los siguientes hashes:
              <pre>{txHash.map((hash) => `${hash}\n`)}</pre>
            </>
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
                    {files.length > 0
                      ? files.map(
                          (file) =>
                            `${t('newDocument:fileName')} ${file.name}\n${t(
                              'newDocument:fileHash'
                            )} ${file.hash.substr(0, 8)}...${file.hash.substr(
                              -8
                            )}\n`
                        )
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
              <Button disabled={isDisabled} type="submit">
                {isDisabled
                  ? t('newDocument:noLocation')
                  : t('newDocument:submit')}
              </Button>
            </>
          )}
        </Form>
      </FormWrap>
    </>
  );
}

export default NewDocument;
