import { useChecklistChecklistListQuery } from '@/redux/api';
import { Group, Table, TableData } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import { IconEdit, IconEditCircle, IconPhoto, IconRun } from '@tabler/icons-react';
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
        <Link to={`/template/${template.id}`}>
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
      template.created_at,
      template.created_by?.first_name + ' ' + template.created_by?.last_name,
    ]),
  };
  return (
    <div>
      <Link to={`/project/${project}/template/new`}>
        <Button>Create new checklist</Button>
      </Link>
      <Table data={tableData} />
    </div>
  );
}
