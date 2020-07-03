import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  width: 350px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  display: ${(props) => (props.show ? 'block' : 'none')};
  margin-top: 5px;
  overflow: hidden;
  font-size: 0.875rem;
  background-color: hsla(0, 0%, 100%, 0.85);
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.25rem;
  z-index: 100;
`;
const ToastDismissButton = styled.button`
  float: right;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
  padding: 0;
  border: 0;
  background-color: transparent;
`;

const ToastHeader = styled.div`
  display: flex;
  height: 37px;
  align-items: center;
  padding: 0.25rem 0.75rem;
  color: #6c757d;
  background-color: hsla(0, 0%, 100%, 0.85);
  background-clip: padding-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;
const ToastBody = styled.div`
  padding: 0.75rem;
`;

export default function Toast({ show, children }) {
  return (
    <ToastContainer show={show}>
      <ToastHeader>
        <strong style={{ marginRight: 'auto' }}>Notificación</strong>
        <ToastDismissButton>
          <span>X</span>
        </ToastDismissButton>
      </ToastHeader>
      <ToastBody>{children}</ToastBody>
    </ToastContainer>
  );
}
