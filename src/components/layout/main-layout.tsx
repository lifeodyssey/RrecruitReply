
import { Footer } from './footer';
import { Header } from './header';

import type { ReactElement, ReactNode } from 'react';


interface IMainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps): ReactElement => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
