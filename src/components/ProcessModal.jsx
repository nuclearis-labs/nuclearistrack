// modal.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  Button,
  Scroll,
  PassphraseButton,
  PassphraseInput,
} from '../styles/components';
import { ErrorForm } from '../styles/form';
import { Row, HeadRow, Col4 } from '../styles/tableComponents';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { useAsync } from '../hooks/useAsync';
import OutsideClickHandler from 'react-outside-click-handler';
import Spinner from './Spinner';

const ModalWrap = styled.div`
  width: 540px;
  height: 350px;
  position: fixed;
  top: 320px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  z-index: 999999;
`;

const ModalTop = styled.div`
  width: 100%;
  height: 140px;
  color: #fff;
  padding: 30px 20px 10px 50px;
  box-sizing: border-box;
`;

const ModalBottom = styled.div`
  width: 100%;
  height: 210px;
  background: #999;
  color: #333;
  padding: 5px 20px 10px 30px;
  box-sizing: border-box;
  ${HeadRow} {
    width: calc(100% - 34px);
    margin-left: 20px;
  }
`;

const ModalTit = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 26px;
`;

const ModalInput = styled.input`
  font-family: 'Roboto Condensed', sans-serif;
  border: none;
  width: 190px;
  height: 23px;
  padding: 5px;
  color: #333;
  cursor: text;
  font-size: 13px;
  font-weight: 300;
  box-sizing: border-box;
  background: #e6e6e6;
  margin: 5px 0;
  &:active,
  &:focus {
    text-align: left;
  }
`;

const ModalTxt = styled.div`
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 1px;
  line-height: 20px;
`;

const ModalProdName = styled.div`
  font-weight: 700;
  font-size: 23px;
  letter-spacing: 1px;
  line-height: 20px;
  margin: 3px 0;
`;

const ScrollBox130 = styled(Scroll)`
  height: 115px;
  overflow: scroll;
`;

function ProcessModal(props: any) {
  const { register, handleSubmit, getValues } = useForm();
  const { execute, pending, error } = useAsync(onSubmit, false);

  function onSubmit() {
    console.log('submit');
  }

  return (
    <OutsideClickHandler onOutsideClick={props.closeModal} display="contents">
      <ModalWrap>
        <form onSubmit={handleSubmit(execute)}>
          <ModalTop>
            <ModalTit>AGREGAR PROCESOS</ModalTit>
            <ModalInput placeholder="BUSCAR" ref={register}></ModalInput>
            <ModalTxt>
              SELECCIONE LOS PROCESOS QUE DESEA AGREGAR AL PROYECTO
            </ModalTxt>
            <ModalProdName>{props.project.title}</ModalProdName>
          </ModalTop>
          <ModalBottom>
            <HeadRow>
              <Col4>NOMBRE</Col4>
              <Col4>PROVEEDOR</Col4>
              <Col4>DOCUMENTOS</Col4>
            </HeadRow>
            <ScrollBox130>
              <Row key={process.processContracts}>
                <input
                  type="radio"
                  style={{
                    width: '15px',
                    height: '15px',
                    marginRight: '10px',
                  }}
                  id={process.processContracts}
                  name="processContract"
                  value={process.processContracts}
                  ref={register}
                />
                <Col4>{process.processName}</Col4>
                <Col4>{process.supplierName}</Col4>
                <Col4>
                  <Link to={'/documents/' + process.processContracts}>
                    <Eye />
                    VER DOC.
                  </Link>
                </Col4>
              </Row>
            </ScrollBox130>
            <div>
              <PassphraseInput
                type="password"
                name="passphrase"
                autoComplete="password"
                ref={register}
                style={{ background: 'white' }}
                placeholder="Ingresar clave"
              />
              <PassphraseButton
                type="submit"
                style={{ width: 'fit-content' }}
                disabled={pending}
              >
                {pending ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  '+ AGREGAR PROCESOS'
                )}
              </PassphraseButton>
              <ErrorForm>{error && error.error}</ErrorForm>
            </div>
          </ModalBottom>
        </form>
      </ModalWrap>
    </OutsideClickHandler>
  );
}
export default ProcessModal;
