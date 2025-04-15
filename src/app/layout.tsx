import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/components/auth/AuthProvider';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
