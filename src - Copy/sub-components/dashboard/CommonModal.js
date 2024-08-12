import React,{useState,memo} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const CommonModal = ({show,onClose,children,heading,body}) => {
  return (
    <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{heading}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{body}</Modal.Body>
    <Modal.Footer>
        {children}    
    </Modal.Footer>
  </Modal>
  )
}

export default memo(CommonModal)