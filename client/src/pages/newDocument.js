// newProvider.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import {
  Title,
  Label,
  Input,
  FileInput,
  TextArea,
  Button,
  Wrap,
  ProcessName,
  SubTit,
  Pad
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import Header from '../components/header.js';
import axios from 'axios';
import Footer from '../components/footer.js';

export default function NewDoc(props) {
  const [processDetail, setProcess] = useState([]);
  const [form, setForm] = useState([]);
  const [file, setFile] = useState();
  const [location, setLocation] = useState();
  const [enableSubmit, setEnableSubmit] = useState({
    state: false,
    text: 'CREAR'
  });
  let { process } = useParams();
  console.log(process);

  useEffect(() => {
    axios({
      method: 'get',
      url:
        '/api/process/getOne?contract=0x1EdcdE414000B0B182761168CC72B4c01B21fD0A',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(({ data }) => {
      setProcess(data);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(
            `https://www.google.com/maps/embed/v1/view?zoom=13&center=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs`
          );
          setForm(form => ({
            ...form,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }));
        },
        () => {
          setEnableSubmit({
            disabled: true,
            text: 'ERROR: ENABLE GEOLOCATION'
          });
        }
      );
    } else {
      setEnableSubmit({
        disabled: true,
        text: 'GEOLOCATION NOT SUPPORTED, CHANGE BROWSER'
      });
    }
  }, []);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleFileInput(e) {
    e.persist();
    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = new FormData();
    data.append('file', file);
    data.append('email', 'imeco@nuclearis.com');
    data.append('passphrase', 'imeco');
    data.append('comment', form.observaciones);
    data.append('latitude', '-34.4354534');
    data.append('longitude', '-59.2434234');
    axios({
      method: 'post',
      url:
        '/api/doc/upload?contract=0x1EdcdE414000B0B182761168CC72B4c01B21fD0A',
      data: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'content-type': 'multipart/form-data'
      }
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch(e => {});
  }

  return (
    <>
      <Header />
      <Wrap>
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
                {processDetail.processName &&
                  processDetail.processName.toUpperCase()}
              </ProcessName>
              <SubTit>PROVEEDOR</SubTit>
              <SubTit className="bold">
                {processDetail.supplierName &&
                  processDetail.supplierName.toUpperCase()}
              </SubTit>
            </Pad>
            <Label>SELECCIONAR ARCHIVO</Label>
            <FileInput
              onChange={handleFileInput}
              name="file"
              type="file"
            ></FileInput>
            <Label>UBICACION DEL DOCUMENTO</Label>
            <iframe
              frameBorder="0"
              title="DocumentLocation"
              style={{ border: '0', width: '370px', height: '250px' }}
              src={location}
              allowFullScreen
            ></iframe>{' '}
            <Label>OBSERVACIONES</Label>
            <TextArea onChange={handleInput} name="observaciones"></TextArea>
            <Button
              onClick={handleSubmit}
              disabled={enableSubmit.disabled}
              className="submit"
            >
              {enableSubmit.text}
            </Button>
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
