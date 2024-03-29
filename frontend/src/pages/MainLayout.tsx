import { Container, Paper } from '@mantine/core';
import { ReactNode } from 'react';
import { Notifications } from '@mantine/notifications';
import { Header } from '@/components/shared/Header';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: Readonly<MainLayoutProps>) {
  return (
    <>
      <Header />
      <Notifications position="top-right" zIndex={1000} autoClose={2000} />
      <Container fluid m="lg">
        <Paper shadow="xs">{children}</Paper>
      </Container>
    </>
  );
}
