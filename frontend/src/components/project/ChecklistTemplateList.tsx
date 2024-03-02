import { Group, Table, TableData, ActionIcon, Popover, Button } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { IconEdit, IconPlus, IconRun, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useChecklistChecklistDestroyMutation, useChecklistChecklistListQuery } from '@/redux/api';

export default function ChecklistTemplateList() {
  const { project } = useParams();
  const [destroy] = useChecklistChecklistDestroyMutation();
  const { data: templates } = useChecklistChecklistListQuery({
    project: project as string,
    page: 1,
    pageSize: 20,
  });
  const tableData: TableData = {
    caption: `List of available checklists for ${project}`,
    head: ['Edit/Run', 'Title', 'Line items', 'Created at', 'Created By'],
    body: templates?.results?.map((template) => [
      <Group key={template.id}>
        <ActionIcon
          component="a"
          href={`/project/${project}/checklist/${template.id}`}
          variant="filled"
          size="sm"
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon variant="filled" size="sm">
          <IconRun />
        </ActionIcon>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="filled" color="red" size="sm">
              <IconTrash />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            You sure you want to delete checklist?
            <Group>
              <Button size="xs" onClick={() => destroy({ id: template.id })}>
                Yes
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Group>,
      template.title,
      template.line_items,
      dayjs(template.created_at).format('DD/MM/YYYY hh:mm'),
      `${template.created_by?.first_name} ${template.created_by?.last_name}`,
    ]),
  };
  return (
    <div>
      <ActionIcon component="a" href={`/project/${project}/checklist`} variant="filled" size="sm">
        <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      <Table data={tableData} />
    </div>
  );
}
