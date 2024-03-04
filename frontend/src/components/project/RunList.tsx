import { ActionIcon, Badge, Group, Table, TableData } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import formatDate from '@/hooks/formatDate';
import { useChecklistChecklistRunListQuery } from '@/redux/api';

export default function RunList() {
  const { project } = useParams();
  const { data: runs } = useChecklistChecklistRunListQuery({
    project: project as string,
    page: 1,
    pageSize: 20,
  });
  const tableData: TableData = {
    head: [
      'Status/Action',
      'Checklist',
      'Total/Passed/Failed',
      'Created at',
      'Created by',
      'Duration seconds',
    ],
    body: runs?.results?.map((run) => [
      <Group key={run.id}>
        <Badge>{run.status}</Badge>
        <ActionIcon
          component="a"
          href={`/project/${project}/checklist/${run.check_list.id}/run/${run.id}`}
          variant="filled"
          size="sm"
        >
          <IconEye />
        </ActionIcon>
      </Group>,
      run.check_list.title,
      <Group>
        <Badge>{run.line_items}</Badge>
        <Badge color="red">{run.failed}</Badge>
        <Badge color="green">{run.passed}</Badge>
      </Group>,
      formatDate(run.created_at),
      `${run.created_by?.first_name} ${run.created_by?.last_name}`,
      run.duration,
    ]),
  };
  return (
    <div>
      <Table data={tableData} />
    </div>
  );
}
