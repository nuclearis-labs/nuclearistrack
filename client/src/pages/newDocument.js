// newProvider.js
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/userContext';
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
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Footer from '../components/footer.js';

export default function NewDoc(props) {
  const { getCurrentUser } = useContext(UserContext);

  const [user] = useState(getCurrentUser());

  const [processDetail, setProcess] = useState([]);
  const [form, setForm] = useState([]);
  const [file, setFile] = useState();
  const [location, setLocation] = useState();
  const [loading, setLoading] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState({
    state: false,
    text: 'CREAR'
  });
  let { process } = useParams();

  useEffect(() => {
    setLoading(true);
    axios({
      method: 'get',
      url: '/api/process/getOne?contract=' + process,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(({ data }) => {
        setLoading(false);
        setProcess(data);
      })
      .catch(e => console.error(e));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(position.coords);
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
  }, [process]);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleFileInput(e) {
    e.persist();
    console.log(e.target.files[0]);

    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = new FormData();
    data.append('file', file);
    data.append('name', file.name.substr(0, file.name.length - 4));
    data.append('email', user.userEmail);
    data.append('passphrase', form.passphrase);
    data.append('comment', form.comment);
    data.append('latitude', location.latitude);
    data.append('longitude', location.longitude);
    axios({
      method: 'post',
      url: '/api/doc/upload?contract=' + process,
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
            <SubTit>PROCESO {user.userName}</SubTit>
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
          <TextArea onChange={handleInput} name="comment"></TextArea>
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
              onChange={handleInput}
            ></Input>
            <Button
              style={{ display: 'inline-block', position: 'relative' }}
              onClick={handleSubmit}
              disabled={enableSubmit.disabled}
              className="submit"
            >
              {loading ? (
                <Spinner animation="border" role="status" size="sm"></Spinner>
              ) : (
                enableSubmit.text
              )}
            </Button>
          </div>
        </Form>
      </FormWrap>
      <Footer />
    </>
  );
}
