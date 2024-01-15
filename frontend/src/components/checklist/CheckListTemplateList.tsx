import React from "react";
import {
  CheckList,
  CheckListRead,
  PaginatedCheckListListRead,
  useChecklistChecklistDestroyMutation,
  useChecklistChecklistListQuery,
  useRunChecklistMutation
} from "../../redux/api";
import { usePagination } from "../../hooks/usePagination";
import { DateFormat, defaultPagination } from "../../settings/settings";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
export default function CheckListTemplateList(props: { project: string }) {
  const [page, setPage] = React.useState(defaultPagination.page);
  const [pageSize, setPageSize] = React.useState(defaultPagination.pageSize);
  const [run] = useRunChecklistMutation();
  const navigate = useNavigate();

  const { data, isLoading } = useChecklistChecklistListQuery({
    page: page,
    pageSize: pageSize,
    project: props.project
  });

  const [deleteChecklist] = useChecklistChecklistDestroyMutation();
  const runChecklist = (id: number) => {
    run({ id: id })
      .unwrap()
      .then((resp) => {
        navigate(`/${props.project}/template-run/${resp.id}`);
      });
  };

  const tablePagination = usePagination<PaginatedCheckListListRead>({
    name: "checklist-table",
    total: data?.count,
    pageSize: pageSize,
    setPage,
    setPageSize
  });

  const columns: ColumnsType<CheckList> = [
    {
      title: "Title",
      width: "5%",
      render: (record: CheckListRead) => <Tag>{record.title}</Tag>
    },
    {
      title: "Line items",
      width: "2%",
      render: (record: CheckListRead) => <span>{record.line_items}</span>
    },
    {
      title: "Created",
      width: "2%",
      render: (record: CheckListRead) => (
        <span>
          {`${dayjs(record.created_at).format(DateFormat)} by ${record.created_by?.email}`}
        </span>
      )
    },
    {
      title: "Updated",
      width: "2%",
      render: (record: CheckListRead) => (
        <span>
          {`${dayjs(record.updated_at).format(DateFormat)} by
          ${record.updated_by?.email}`}
        </span>
      )
    },
    {
      title: "Actions",
      width: "5%",
      render: (record: CheckListRead) => (
        <Space>
          <Popconfirm
            title="Delete"
            description="Are you sure to delete this checklist?"
            onConfirm={() => {
              deleteChecklist({ id: record.id });
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Link to={`template/${record.id}`}>
            <Button>Edit</Button>
          </Link>
          <Button type="primary" onClick={() => runChecklist(record.id)}>
            Run
          </Button>
        </Space>
      )
    }
  ];
  return (
    <div>
      <Space>
        <Link to={"template/new/"} relative="path">
          <Button type="primary">Add new checklist</Button>
        </Link>
      </Space>
      <Table
        loading={isLoading}
        bordered
        size="small"
        columns={columns}
        dataSource={data?.results}
        rowKey="id"
        pagination={tablePagination}
      />
    </div>
  );
}
