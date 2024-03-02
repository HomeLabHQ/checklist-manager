import { Group, Table, TableData, Button } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { IconEdit, IconRun } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useChecklistChecklistListQuery } from '@/redux/api';

export default function ChecklistTemplateList() {
  const { project } = useParams();
  const { data: templates } = useChecklistChecklistListQuery({
    project: project as string,
    page: 1,
    pageSize: 10,
  });

  const tableData: TableData = {
    caption: 'List of available projects',
    head: ['Edit/Run', 'Title', 'Line items', 'Created at', 'Created By'],
    body: templates?.results?.map((template) => [
      <Group key={template.id}>
        <Link to={`/project/${project}/checklist/${template.id}`}>
          <Button>
            <IconEdit />
          </Button>
        </Link>
        <Button>
          <IconRun />
        </Button>
      </Group>,
      template.title,
      template.line_items,
      dayjs(template.created_at).format('DD/MM/YYYY hh:mm'),
      `${template.created_by?.first_name} ${template.created_by?.last_name}`,
    ]),
  };
  return (
    <div>
      <Link to={`/project/${project}/checklist/new`}>
        <Button>Create new checklist</Button>
      </Link>
      <Table data={tableData} />
    </div>
  );
}
