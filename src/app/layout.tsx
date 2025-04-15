import { Inter, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/components/auth/AuthProvider';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RecruitReply - AI-Powered Recruitment Assistant',
  description:
    'A RAG system for recruitment agents to reduce time spent answering repetitive questions.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
