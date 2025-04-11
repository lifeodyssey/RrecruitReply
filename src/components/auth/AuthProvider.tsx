'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 * 
 * This component wraps the application with the NextAuth SessionProvider
 * to provide authentication context throughout the app.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
