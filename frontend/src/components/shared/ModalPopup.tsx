import { Button, Modal, message } from "antd";
import { ButtonType } from "antd/es/button";
import React from "react";

interface ModalProps {
  message: string;
  danger?: boolean;
  type?: ButtonType;
  children: React.ReactElement;
  handler?: (value: string) => void;
}
export default function ModalPopup(props: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const [msg, contextHolder] = message.useMessage();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const child = React.Children.map(props.children, (el) => {
    return React.cloneElement(el, { handleClose: handleClose, msg: msg, handler: props.handler });
  });

  return (
    <React.Fragment>
      <Button type={props.type} danger={props.danger} onClick={handleClickOpen}>
        {props.message}
      </Button>
      <Modal
        footer={null}
        title={props.message}
        open={open}
        onCancel={handleClose}
        style={{ maxHeight: 900 }}
      >
        {contextHolder}
        {child}
      </Modal>
    </React.Fragment>
  );
}
