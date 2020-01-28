// newProvider.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Title, Label, Input, Button, Wrap } from '../components/components.js';
import { Top, Form, FormWrap } from '../components/form.js';
import { CustomModal } from '../components/CustomModal';
import RSKLink from '../components/RSKLink';
import Footer from '../components/footer.js';
import Header from '../components/header.js';

export default function ConfirmUser() {
  const [form, setForm] = useState([]);
  const [event, setEvent] = useState({});
  const { id } = useParams();
  const [modalShow, setModalShow] = useState(false);

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios({
      method: 'post',
      url: `/api/user/confirm/${id}`,
      data: {
        ...form
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(result => {
        if (result.data.error) {
          setEvent(result.data.error);
        } else {
          setEvent(result.data);
          setModalShow(true);
        }
      })
      .catch(e => {
        setEvent('Not able to save User to the Blockchain, try later again');
      });
  }

  return (
    <>
      <Header />
      <Wrap>
        <Top>
          <Title>
            CONFIRM
            <br />
            USER
          </Title>
        </Top>
        <FormWrap>
          <Form>
            <Label>PASSPHRASE</Label>
            <Input
              type="password"
              name="passphrase"
              onChange={handleInput}
            ></Input>
            <Label>CONFIRM PASSPHRASE</Label>
            <Input
              type="password"
              name="confirm_passphrase"
              onChange={handleInput}
            ></Input>
            <Button className="submit" onClick={handleSubmit}>
              CREAR
            </Button>
            {event.hasOwnProperty('address') && (
              <CustomModal
                title="User Confirmation Successfull"
                body={
                  <>
                    <p>
                      Your account has been successfully generated and sended to
                      the Blockchain.
                    </p>
                    <ul>
                      <li>Name: {event && event.username}</li>
                      <li>Email: {event && event.email}</li>
                      <li>
                        Mnemonic Passphrase:{' '}
                        <span
                          title="Click for copy"
                          style={{
                            color: 'blue',
                            'text-decoration': 'underline',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(event.mnemonic);
                          }}
                        >
                          {event && event.mnemonic}
                        </span>
                      </li>
                      <li>
                        Address:{' '}
                        <a
                          href={
                            'https://explorer.testnet.rsk.co/address/' +
                            event.address
                          }
                        >
                          {event && event.address}
                        </a>
                      </li>
                      <li>
                        Transaction:{' '}
                        <RSKLink
                          hash={event && event.txHash}
                          type="tx"
                          testnet
                        />
                      </li>
                    </ul>
                    <p>
                      Les sugerimos de anotar en un medio seguro la clave
                      mnemonica, ya que es la unica forma de recuperar su cuenta
                      en caso de que se olvide su clave ingresada.
                    </p>
                  </>
                }
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            )}
          </Form>
        </FormWrap>
      </Wrap>
      <Footer />
    </>
  );
}
