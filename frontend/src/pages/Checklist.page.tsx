import { useParams } from 'react-router-dom';
import MainLayout from './MainLayout';
import { useChecklistChecklistRetrieveQuery, useChecklistProjectRetrieveQuery } from '@/redux/api';
import CreateCheckList from '@/components/project/CreateCheckList';
import EditCheckList from '@/components/project/EditCheckList';

export function ChecklistPage() {
  const { project, checklist } = useParams();
  const { data: project_data } = useChecklistProjectRetrieveQuery(
    { code: project ?? '' },
    { skip: !project }
  );
  const { data: checklist_data } = useChecklistChecklistRetrieveQuery(
    { id: Number(checklist) },
    { skip: !checklist }
  );

  return (
    <MainLayout>
      {project_data && !checklist_data && <CreateCheckList project={project_data} />}
      {checklist_data && project_data && (
        <EditCheckList project={project_data} checklist={checklist_data} />
      )}
    </MainLayout>
  );
}
