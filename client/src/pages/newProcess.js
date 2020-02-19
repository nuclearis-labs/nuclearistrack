// newProvider.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Title,
  Label,
  Input,
  Select,
  Button,
  Wrap
} from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { CustomModal } from '../components/CustomModal';
import RSKLink from '../components/RSKLink';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Spinner from 'react-bootstrap/Spinner';

export default function NewProcess() {
  const [users, setUsers] = useState();
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    axios.get('/api/user/get').then(({ data }) => {
      const suppliers = data.filter(user => user.type === '1');
      setUsers(suppliers);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    axios({
      method: 'post',
      url: '/api/process/',
      data: { ...form },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(({ data }) => {
        setLoading(false);

        setEvent(data);
        setModalShow(true);
      })
      .catch(e => setLoading(false));
  }
  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>
            NUEVO
            <br />
            PROCESO
          </Title>
        </Top>
        <FormWrap>
          <Form>
            <Label>NOMBRE</Label>
            <Input name="processTitle" onChange={handleInput}></Input>
            <Label>PROVEEDOR</Label>
            <Select name="supplierAddress" onChange={handleInput}>
              <option>Select one...</option>
              {users &&
                users.map(user => (
                  <option value={user.address} key={user.address}>
                    {user.name}
                  </option>
                ))}
            </Select>
            <Button className="submit" onClick={handleSubmit}>
              {loading ? (
                <Spinner animation="border" role="status" size="sm"></Spinner>
              ) : (
                'CREAR'
              )}
            </Button>
            <CustomModal
              title="Project Creation Successfull"
              body={
                <>
                  <p>A new process was created successfully</p>
                  <ul>
                    <li>Name: {form.processTitle}</li>
                    <li>
                      Transaction Hash:{' '}
                      <RSKLink hash={event} type="tx" testnet />
                    </li>
                  </ul>
                </>
              }
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
