import React from "react";
import { Table } from "antd";
import { usePagination } from "../../hooks/usePagination";
import { PaginatedProjectList, ProjectRead, useChecklistProjectListQuery } from "../../redux/api";
import { DateFormat, defaultPagination } from "../../settings/settings";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function ProjectList() {
  const [page, setPage] = React.useState(defaultPagination.page);
  const [pageSize, setPageSize] = React.useState(defaultPagination.pageSize);
  const { data, isLoading } = useChecklistProjectListQuery({ page: page, pageSize: pageSize });

  const tablePagination = usePagination<PaginatedProjectList>({
    name: "project-table",
    total: data?.count,
    pageSize: pageSize,
    setPage,
    setPageSize
  });

  const columns: ColumnsType<ProjectRead> = [
    {
      title: "Code",
      width: "5%",
      render: (record: ProjectRead) => (
        <Link to={record.code} relative="path">
          {record.code}
        </Link>
      )
    },
    {
      title: "Name",
      width: "5%",
      render: (record: ProjectRead) => <span>{record.title}</span>
    },
    {
      title: "Level",
      width: "5%",
      render: (record: ProjectRead) => <span>{record.level}</span>
    },
    {
      title: "Updated",
      width: "5%",
      render: (record: ProjectRead) => <span>{dayjs(record.updated_at).format(DateFormat)}</span>
    },
    {
      title: "Created",
      width: "5%",
      render: (record: ProjectRead) => <span>{dayjs(record.created_at).format(DateFormat)}</span>
    }
  ];
  return (
    <div>
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
