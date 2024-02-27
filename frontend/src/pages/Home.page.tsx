import { ProjectList } from '@/components/project/ProjectList';
import MainLayout from './MainLayout';
export function HomePage() {
  return (
    <MainLayout>
      <ProjectList />
    </MainLayout>
  );
}
