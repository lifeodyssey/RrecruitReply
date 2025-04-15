'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTurnstileVerification } from '@/hooks/useTurnstileVerification';
import { TurnstileWidget } from './TurnstileWidget';

import type { ReactElement } from 'react';

// Get the site key from environment variables
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

interface ITurnstileVerificationProps {
  onVerificationComplete: () => void;
}

/**
 * Turnstile verification component
 *
 * This component handles the verification flow for Cloudflare Turnstile,
 * showing a CAPTCHA widget and handling the verification process.
 */
export const TurnstileVerification = ({
  onVerificationComplete,
}: ITurnstileVerificationProps): ReactElement => {
  const { isVerified, isLoading, verifyToken } = useTurnstileVerification();
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // If already verified, call the completion handler
  if (isVerified && !isLoading) {
    onVerificationComplete();
    return <div data-testid="verification-complete"></div>;
  }

  // Handle token verification
  const handleVerify = async (token: string): Promise<void> => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const success = await verifyToken(token);

      if (success) {
        onVerificationComplete();
      } else {
        setVerificationError('Verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle verification errors
  const handleError = (_error: Error): void => {
    setVerificationError('An error occurred with the verification widget. Please try again.');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loading-spinner" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Human Verification</CardTitle>
        <CardDescription>
          Please complete the verification below to continue using the chat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {TURNSTILE_SITE_KEY ? (
          <div className="flex flex-col items-center">
            <TurnstileWidget
              siteKey={TURNSTILE_SITE_KEY}
              onVerify={handleVerify}
              onError={handleError}
              theme="auto"
              className="mx-auto"
            />
            {verificationError && (
              <p className="text-sm text-destructive mt-2">{verificationError}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-destructive">
            Verification is not configured properly. Please contact the administrator.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {isVerifying && (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
