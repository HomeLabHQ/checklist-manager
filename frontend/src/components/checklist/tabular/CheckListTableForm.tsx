import { Button, Flex, Form, Input, Table } from "antd";
import { useEffect, useState } from "react";

import {
  CheckListRead,
  CheckListRequest,
  ProjectRead,
  useChecklistChecklistCreateMutation,
  useChecklistChecklistUpdateMutation
} from "../../../redux/api";
import TableModal from "./TableModal";
import { Link, useNavigate } from "react-router-dom";
import { AnyObject } from "antd/es/_util/type";

export default function CheckListTableForm(
  props: Readonly<{ project: ProjectRead; checklist?: CheckListRead }>
) {
  const [addChecklist] = useChecklistChecklistCreateMutation();
  const [update] = useChecklistChecklistUpdateMutation();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<AnyObject[]>([]);
  const [columns, setColumns] = useState<AnyObject[]>([
    {
      title: "",
      dataIndex: "title",
      key: "title"
    }
  ]);
  // * Mapping  existing data to table
  useEffect(() => {
    if (props.checklist?.columns) {
      const cols = props.checklist.columns.map((item) => {
        return { title: item.title, dataIndex: item.title, key: item.title };
      });
      setColumns([...columns, ...cols]);
    }
    if (props.checklist?.rows) {
      const attributes = props.checklist.columns?.map((item) => {
        return item.title;
      });
      const rows = props.checklist.rows.map((item) => {
        const row: AnyObject = { ...item, key: item.title };
        attributes?.map((attribute) => {
          row[attribute] = "NOT_PERFORMED";
        });
        return row;
      });
      setDataSource(rows);
    }
  }, [props.checklist]);
  const submit = (values: CheckListRequest) => {
    const cols = columns.map((item) => {
      return { title: item.key };
    });
    // * Remove index column
    cols.splice(0, 1);
    const rows = dataSource.map((item) => {
      return { title: item.title };
    });
    const cells = dataSource?.map((item) => {
      return columns.splice(0, 1).map((col) => {
        return { column: col.title, row: item.key, expected_status: item[col.title] };
      });
    });
    if (props.checklist) {
      update({
        id: Number(props.checklist.id),
        checkListRequest: { ...values, columns: cols, rows: rows }
      }).then(() => {
        navigate(`/${props.project.code}`);
      });
      return;
    }
    addChecklist({
      checkListRequest: { ...values, columns: cols, rows: rows, cells: [...cells] }
    })
      .unwrap()
      .then(() => {
        navigate(`/${props.project.code}`);
      })
      .catch(() => {});
  };

  return (
    <Form
      layout="vertical"
      initialValues={
        props.checklist ? { ...props.checklist } : { project: props.project.id, variant: "TABULAR" }
      }
      onFinish={submit}
    >
      <Form.Item name="project" hidden={true}>
        <Input type="text" value={props.project.id} />
      </Form.Item>
      <Form.Item name="variant" hidden={true}>
        <Input type="text" value="TABULAR" />
      </Form.Item>
      <Form.Item
        label="Checklist name"
        name="title"
        rules={[{ required: true, message: "Please input template name" }]}
      >
        <Input type="text" />
      </Form.Item>
      <TableModal
        type="column"
        handlerColumns={setColumns}
        columns={columns}
        handlerRows={setDataSource}
        rows={dataSource}
      />
      <TableModal
        type="row"
        handlerColumns={setColumns}
        columns={columns}
        handlerRows={setDataSource}
        rows={dataSource}
      />
      <Table dataSource={dataSource} columns={columns} />
      <Flex justify="space-between" align="space-around">
        <Link to={`/${props.project.code}`}>
          <Button>Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Flex>
    </Form>
  );
}
