import { Table, Tag } from "antd";
import {
  CheckListRunRead,
  PaginatedCheckListRunList,
  useChecklistChecklistRunListQuery
} from "../../../redux/api";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { usePagination } from "../../../hooks/usePagination";
import { DateFormat, defaultPagination } from "../../../settings/settings";
import React from "react";
import { Link } from "react-router-dom";
import { useDuration } from "../../../hooks/useDuration";
import StatusBadge from "../../shared/StatusBadge";
export default function CheckListRunList(props: { project: string }) {
  const [page, setPage] = React.useState(defaultPagination.page);
  const [pageSize, setPageSize] = React.useState(defaultPagination.pageSize);
  const { data, isLoading } = useChecklistChecklistRunListQuery({
    project: props.project,
    page: page,
    pageSize: pageSize
  });
  const tablePagination = usePagination<PaginatedCheckListRunList>({
    name: "checklist-run-table",
    total: data?.count,
    pageSize: pageSize,
    setPage,
    setPageSize
  });

  const columns: ColumnsType<CheckListRunRead> = [
    {
      title: "id",
      width: "1%",
      render: (record: CheckListRunRead) => (
        <Link to={`/${props.project}/template-run/${record.id}`}>{record.id}</Link>
      )
    },
    {
      title: "Checklist",
      width: "5%",
      render: (record: CheckListRunRead) => <span>{record.checklist}</span>
    },
    {
      title: "Status",
      width: "5%",
      render: (record: CheckListRunRead) => <StatusBadge status={record.status} />
    },
    {
      title: "Created",
      width: "5%",
      render: (record: CheckListRunRead) => (
        <span>{dayjs(record.created_at).format(DateFormat)}</span>
      )
    },
    {
      title: "Total/Failed/Passed",
      width: "5%",
      render: (record: CheckListRunRead) => (
        <>
          <Tag color="blue">{record.line_items}</Tag>
          <Tag color="red">{record.failed}</Tag>
          <Tag color="green">{record.passed}</Tag>
        </>
      )
    },
    {
      title: "Duration",
      width: "5%",
      render: (record: CheckListRunRead) => <span>{useDuration(record.duration)}</span>
    }
  ];
  return (
    <Table
      loading={isLoading}
      columns={columns}
      size="small"
      dataSource={data?.results}
      rowKey="id"
      pagination={tablePagination}
    />
  );
}
