'use client';

import { SessionProvider } from 'next-auth/react';

import type { JSX, ReactNode } from 'react';

interface IAuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 *
 * This component wraps the application with the NextAuth SessionProvider
 * to provide authentication context throughout the app.
 */
export const AuthProvider = ({ children }: IAuthProviderProps): JSX.Element => (
  <SessionProvider>{children}</SessionProvider>
);
