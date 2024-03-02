import { Container, Paper } from '@mantine/core';
import { ReactNode } from 'react';
import { Notifications } from '@mantine/notifications';
import { Header } from '@/components/shared/Header';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <Notifications position="top-right" zIndex={1000} autoClose={2000} />
      <Container>
        <Paper shadow="xs" p="xl">
          {children}
        </Paper>
      </Container>
    </div>
  );
}
