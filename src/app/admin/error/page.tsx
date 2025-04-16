'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { type ReactElement, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Component that uses useSearchParams() hook
 * This must be wrapped in a Suspense boundary
 */
const SearchParamsProvider = ({
  children,
}: {
  children: (errorCode: string | null) => React.ReactNode;
}): ReactElement => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');

  return <>{children(errorCode)}</>;
};

/**
 * Error content component that receives the error code as a prop
 * instead of using useSearchParams directly
 */
const ErrorContent = ({ errorCode }: { errorCode: string | null }): ReactElement => {
  let errorTitle = 'Authentication Error';
  let errorMessage = 'An error occurred during authentication. Please try again.';

  // Handle specific error types
  switch (errorCode) {
    case 'AccessDenied':
      errorTitle = 'Access Denied';
      errorMessage = 'You do not have permission to access this resource.';
      break;
    case 'Verification':
      errorTitle = 'Verification Error';
      errorMessage = 'The verification link is invalid or has expired.';
      break;
    case 'Configuration':
      errorTitle = 'Configuration Error';
      errorMessage = 'There is a problem with the authentication configuration.';
      break;
    case 'EmailSignin':
      errorTitle = 'Email Sign-in Error';
      errorMessage = 'The email could not be sent. Please try again later.';
      break;
    default:
      // Default case already handled with initial values
      break;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-destructive">{errorTitle}</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you continue to experience issues, please contact the system administrator.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/admin/login">Return to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

/**
 * Error page wrapper component
 * Properly wraps components using useSearchParams in Suspense
 */
const ErrorPageContent = (): ReactElement => (
  <SearchParamsProvider>
    {(errorCode) => <ErrorContent errorCode={errorCode} />}
  </SearchParamsProvider>
);

/**
 * Authentication error page
 *
 * This page displays error messages related to authentication.
 */
const AuthErrorPage = (): ReactElement => (
  <Suspense
    fallback={
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }
  >
    <ErrorPageContent />
  </Suspense>
);

export default AuthErrorPage;
