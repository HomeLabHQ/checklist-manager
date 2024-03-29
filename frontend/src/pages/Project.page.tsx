import { Grid, GridCol } from '@mantine/core';
import ChecklistTemplateList from '@/components/project/ChecklistTemplateList';
import RunList from '@/components/project/RunList';
import MainLayout from '@/pages/MainLayout';
import RunStatistic from '@/components/project/RunStatistic';

export function ProjectPage() {
  return (
    <div>
      <MainLayout>
        <Grid>
          <GridCol span={12}>
            <ChecklistTemplateList />
          </GridCol>
          <GridCol span={6}>
            <RunList />
          </GridCol>
          <GridCol span={6}>
            <RunStatistic />
          </GridCol>
        </Grid>
      </MainLayout>
    </div>
  );
}
