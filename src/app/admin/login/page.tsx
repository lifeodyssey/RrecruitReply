'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

/**
 * Component that uses useSearchParams() hook
 * This must be wrapped in a Suspense boundary
 */
function SearchParamsProvider({ children }: { children: (callbackUrl: string) => React.ReactNode }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin';

  return <>{children(callbackUrl)}</>;
}

/**
 * Login form component that receives the callbackUrl as a prop
 * instead of using useSearchParams directly
 */
function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setMessage({
          text: 'Authentication failed. Please check your email and try again.',
          type: 'error',
        });
      } else {
        setMessage({
          text: 'Check your email for a sign-in link.',
          type: 'success',
        });
      }
    } catch {
      setMessage({
        text: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your email to sign in to the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                'Sign in with Email'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {message && (
            <p className={`text-sm w-full text-center ${
              message.type === 'error' ? 'text-destructive' : 'text-green-600'
            }`}>
              {message.text}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

/**
 * Login page wrapper component
 * Properly wraps components using useSearchParams in Suspense
 */
function LoginPageContent() {
  return (
    <SearchParamsProvider>
      {(callbackUrl) => <LoginForm callbackUrl={callbackUrl} />}
    </SearchParamsProvider>
  );
}

/**
 * Admin login page
 *
 * This page provides a form for administrators to sign in using email authentication.
 */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
