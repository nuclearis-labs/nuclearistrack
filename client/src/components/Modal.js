// modal.js
import React from 'react';
import styled from 'styled-components';
import { HeadRow } from './tableComponents.js';
import { Button, Scroll } from './components.js';
import { Link } from 'react-router-dom';

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: ${props => (props.show ? 'rgba(0, 0, 0, 0.5)' : 'transparent')};
  z-index: 999999;
`;

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
  height: 80px;
  color: #fff;
  padding: 30px 20px 10px 50px;
  box-sizing: border-box;
`;

const ModalBottom = styled.div`
  width: 100%;
  height: 270px;
  background: #999;
  color: #333;
  padding: 20px 20px 10px 30px;
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
  height: 130px;
`;

function Modal(props) {
  return (
    <Backdrop onClick={() => props.setShow(false)} show={props.show}>
      <ModalWrap>
        <ModalTop>
          <ModalTit>{props.title.toUpperCase()}</ModalTit>
        </ModalTop>
        <ModalBottom>
          {props.children}
          <Button style={{ marginTop: '120px' }} as={Link} to={'/users/add'}>
            CONTINUAR
          </Button>
        </ModalBottom>
      </ModalWrap>
    </Backdrop>
  );
}
export default Modal;
