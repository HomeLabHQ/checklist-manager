import { Container } from '@mantine/core';
import { ReactNode } from 'react';
import { Header } from '@/components/shared/Header';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
    </div>
  );
}
