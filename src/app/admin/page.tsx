'use client';

import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';


import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { ReactElement } from 'react';


/**
 * Admin dashboard page
 *
 * This page serves as the main dashboard for administrators.
 * It's protected by the middleware and requires authentication.
 */
const AdminDashboardPage = (): ReactElement => {
  const { data: session, status } = useSession();

  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    redirect('/admin/login');
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  // Handle sign out
  const handleSignOut = (): void => {
    void signOut({ callbackUrl: '/' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Upload and manage recruitment documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage the documents used for answering recruitment questions.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/admin/documents">Manage Documents</a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>View system performance and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor the performance and usage of the RecruitReply system.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/admin/status">View Status</a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Session</CardTitle>
            <CardDescription>Your current session information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {session?.user?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Role:</span>{' '}
                {session?.user ? ((session.user as { role?: string }).role ?? 'admin') : 'admin'}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
