// modal.js
import React from 'react';
import styled from 'styled-components';
import { Button, Scroll } from '../components/components.js';
import { Row, HeadRow, Col4 } from '../components/tableComponents.js';
import { ReactComponent as Eye } from '../img/eye.svg';

const Backdrop = styled.div`
  width: 100%;
  height:100%;
  position: fixed;
  top: 0;
  left: 0;
  background:transparent;
  z-index:999999;
`;

const ModalWrap = styled.div`
  width: 540px;
  height:350px;
  position: fixed;
  top: 320px;
  left: 50%;
  transform: translate(-50%, -50%);
  background:#333;
  z-index:999999;
`;

const ModalTop = styled.div`
  width: 100%;
  height:140px;
  color:#fff;
  padding:30px 20px 10px 50px;
  box-sizing:border-box;
`;

const ModalBottom = styled.div`
  width: 100%;
  height:210px;
  background:#999;
  color:#333;
  padding:5px 20px 10px 30px;
  box-sizing:border-box;
  ${HeadRow} {
    width: calc(100% - 34px);
    margin-left:20px;
  }
`;

const ModalTit = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight:700;
  font-size:16px;
  letter-spacing:1px;
  line-height:26px;
`;

const ModalInput = styled.input`
  font-family: 'Roboto Condensed',sans-serif;
  border: none;
  width:190px;
  height:23px;
  padding: 5px;
  color: #333;
  cursor: text;
  font-size: 13px;
  font-weight: 300;
  box-sizing: border-box;
  background:#e6e6e6;
  margin:5px 0;
  &:active,
  &:focus {
    text-align: left;
  }
`;

const ModalTxt = styled.div`
  font-weight:400;
  font-size:11px;
  letter-spacing:1px;
  line-height:20px;
`;

const ModalProdName = styled.div`
  font-weight:700;
  font-size:23px;
  letter-spacing:1px;
  line-height:20px;
  margin:3px 0;
`;

const ScrollBox130 = styled(Scroll)`
  height:130px;
`;

const Check = styled.div`
  width:13px;
  height:13px;
  border: 1px solid #333;
  box-sizing:border-box;
  margin:1px 7px 1px 0;
  &.checked{background:#333;}
`;

function Modal() {
  return (
    <Backdrop>
    <ModalWrap>
      <ModalTop>
        <ModalTit>AGREGAR PROCESOS</ModalTit>
        <ModalInput placeholder="BUSCAR"></ModalInput>
        <ModalTxt>SELECCIONE LOS PROCESOS QUE DESEA AGREGAR AL PRODUCTO</ModalTxt>
        <ModalProdName>ANILLOS 2018</ModalProdName>
      </ModalTop>
      <ModalBottom>
        <HeadRow>
            <Col4>NOMBRE</Col4><Col4>PROVEEDOR</Col4><Col4>DOCUMENTOS</Col4><Col4>FECHA</Col4>
        </HeadRow>
        <ScrollBox130>
          <Row>
              <Check></Check><Col4>MATERIA PRIMA</Col4><Col4>BGH</Col4><Col4><a href=""><Eye />VER DOC.</a></Col4><Col4>15/02/2019</Col4>
          </Row>
          <Row>
              <Check className="checked"></Check><Col4>MECANIZADO</Col4><Col4>IMECO</Col4><Col4><a href=""><Eye />VER DOC.</a></Col4><Col4>19/02/2018</Col4>
          </Row>
          <Row>
              <Check></Check><Col4>PLATEADO</Col4><Col4>NRS</Col4><Col4><a href=""><Eye />VER DOC.</a></Col4><Col4>02/02/2018</Col4>
          </Row>
          <Row>
              <Check></Check><Col4>MATERIA PRIMA</Col4><Col4>BGH</Col4><Col4><a href=""><Eye />VER DOC.</a></Col4><Col4>15/02/2019</Col4>
          </Row>
          <Row>
              <Check className="checked"></Check><Col4>MECANIZADO</Col4><Col4>IMECO</Col4><Col4><a href=""><Eye />VER DOC.</a></Col4><Col4>19/02/2018</Col4>
          </Row>
          <Row>
              <Check></Check><Col4>PLATEADO</Col4><Col4>NRS</Col4><Col4><a href=""><Eye />VER DOC.</a></Col4><Col4>02/02/2018</Col4>
          </Row>
        </ScrollBox130>
        <Button>+ AGREGAR PROCESOS</Button>
      </ModalBottom>
    </ModalWrap>
    </Backdrop>
  );
}
export default Modal;