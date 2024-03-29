import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Group,
  Table,
  TableData,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconEdit } from '@tabler/icons-react';
import { ProjectRead, useChecklistProjectListQuery } from '@/redux/api';
import { RootState } from '@/redux/store';

export function ProjectList() {
  const { data: projects } = useChecklistProjectListQuery({ page: 1, pageSize: 10 });
  const { user } = useSelector((state: RootState) => state.auth);
  const renderTitle = (project: ProjectRead) => {
    if (user?.email === project.owner.email) {
      return (
        <Group>
          <Badge key={project.code} color="blue">
            {project.title}
          </Badge>
          <ActionIcon
            component="a"
            href={`/project/edit/${project.code}`}
            variant="filled"
            size="sm"
          >
            <IconEdit />
          </ActionIcon>
        </Group>
      );
    }
    return project.title;
  };
  const tableData: TableData = {
    caption: 'List of available projects',
    head: ['Title', 'Code', 'Level'],
    body: projects?.results?.map((project) => [
      renderTitle(project),
      <Link key={project.code} to={`/project/${project.code}`} relative="path">
        {project.code}
      </Link>,
      <Badge key={project.code} color="blue">
        {project.level}
      </Badge>,
    ]),
  };
  return (
    <Container>
      <Link to="/project/new" relative="path">
        <Button size="xs">Create Project</Button>
      </Link>
      <Table data={tableData} />
    </Container>
  );
}
