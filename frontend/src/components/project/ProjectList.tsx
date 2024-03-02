import { Badge, Table, TableData } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useChecklistProjectListQuery } from '@/redux/api';

export function ProjectList() {
  const { data: projects } = useChecklistProjectListQuery({ page: 1, pageSize: 10 });
  const tableData: TableData = {
    caption: 'List of available projects',
    head: ['Title', 'Code', 'Level'],
    body: projects?.results?.map((project) => [
      project.title,
      <Link key={project.code} to={`/project/${project.code}`} relative="path">
        {project.code}
      </Link>,
      <Badge color="blue">{project.level}</Badge>,
    ]),
  };
  return (
    <div>
      <Table data={tableData} />
    </div>
  );
}
