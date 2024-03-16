import { useParams } from 'react-router-dom';
import ProjectForm from '@/components/project/ProjectForm';
import MainLayout from './MainLayout';
import { useChecklistProjectRetrieveQuery } from '@/redux/api';

export default function ProjectDetailPage() {
  const { project } = useParams();
  const { data: project_data } = useChecklistProjectRetrieveQuery(
    { code: project ?? '' },
    { skip: !project }
  );

  return (
    <MainLayout>
      {project_data && <ProjectForm project={project_data} />}
      {!project_data && <ProjectForm />}
    </MainLayout>
  );
}
