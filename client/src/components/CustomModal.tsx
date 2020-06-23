import { Modal } from 'react-bootstrap';
import React from 'react';
import { Button } from '../styles/components';

export interface CustomModalProps {
  title: string;
  body: string;
  onHide: any;
}
export function CustomModal(props: CustomModalProps) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
