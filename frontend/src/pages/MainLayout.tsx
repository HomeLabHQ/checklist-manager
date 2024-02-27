import { Header } from '@/components/shared/Header';
import { Container } from '@mantine/core';
import React, { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
    </div>
  );
}
