// newProvider.js
import React from 'react';
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

export default function NewDocument(props: RouteProps) {
  let { process } = useParams();
  const { register, handleSubmit, errors, getValues } = useForm();
  const { execute, pending } = useAsync(onSubmit, false);
  const { data } = useSWR('/api/process/getOne?contract=' + process, url =>
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(({ data }) => data)
  );
  const { location } = useNavLocation();

  function onSubmit() {
    //   return new Promise((resolve, reject) => {
    //     if (user === undefined) {
    //       reject('No user logged in');
    //     }
    //     const form = getValues();
    //     let data = new FormData();
    //     data.append('file', form.file[0]);
    //     data.append('email', user?.userEmail);
    //     data.append('passphrase', form.passphrase);
    //     data.append('comment', form.comment);
    //     data.append('latitude', location.latitude.toString());
    //     data.append('longitude', location.longitude.toString());
    //     axios({
    //       method: 'post',
    //       url: '/api/doc/upload?contract=' + process,
    //       data: data,
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         'content-type': 'multipart/form-data'
    //       }
    //     })
    //       .then(({ data }) => resolve(data))
    //       .catch(e => reject(e.message));
    //   });
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
          ></FileInput>
          <Label>UBICACION DEL DOCUMENTO</Label>
          {location && (
            <iframe
              frameBorder="0"
              title="DocumentLocation"
              style={{ border: '0', width: '370px', height: '250px' }}
              src={`https://www.google.com/maps/embed/v1/view?zoom=13&center=${location &&
                location.latitude},${location &&
                location.longitude}&key=AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs`}
              allowFullScreen
            ></iframe>
          )}
          <Label>OBSERVACIONES</Label>
          <TextArea name="comment"></TextArea>
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
      </FormWrap>
      <Footer />
    </>
  );
}
