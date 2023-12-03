import { Button, Input, Modal } from "antd";
import React from "react";
interface ModalProps {
  rows: any[];
  columns: any[];
  type: "column" | "row";
  handlerRows: (value: any[]) => void;
  handlerColumns: (value: any[]) => void;
}

export default function TableModal(props: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const renderButton = () => {
    if (props.type == "column") {
      return (
        <Button
          onClick={() => {
            props.handlerColumns([
              ...props.columns,
              { title: value, dataIndex: value, key: value }
            ]);
            props.handlerRows(
              props.rows.map((item) => ({
                ...item,
                [value]: "NOT_PERFORMED"
              }))
            );
            handleClose();
          }}
        >
          Add Column
        </Button>
      );
    }
    return (
      <Button
        onClick={() => {
          const row: any = {
            title: value,
            dataIndex: value,
            key: value
          };
          const attributes = props.columns.map((item) => {
            return item.title;
          });
          attributes?.splice(0, 1);
          attributes?.map((attribute) => {
            row[attribute] = "NOT_PERFORMED";
          });
          console.log(row);
          props.handlerRows([...props.rows, row]);
          handleClose();
        }}
      >
        Add Row
      </Button>
    );
  };
  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>{`Add ${props.type}`}</Button>
      <Modal footer={null} open={open} onCancel={handleClose} style={{ maxHeight: 900 }}>
        <Input onChange={(e) => setValue(e.target.value)} />
        {renderButton()}
      </Modal>
    </React.Fragment>
  );
}
