import ChecklistTemplateList from '@/components/project/ChecklistTemplateList';
import MainLayout from '@/pages/MainLayout';

export function ProjectPage() {
  return (
    <div>
      <MainLayout>
        <ChecklistTemplateList />
      </MainLayout>
    </div>
  );
}
