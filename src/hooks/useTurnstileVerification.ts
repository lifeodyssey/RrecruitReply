'use client';

import { useEffect, useState } from 'react';

// Constants
const STORAGE = {
  KEY: 'turnstile-verification',
};

const TIME = {
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,
  MS_IN_SECOND: 1000,
};

// Calculated constants
const VERIFICATION_EXPIRY_TIME =
  TIME.HOURS_IN_DAY * TIME.MINUTES_IN_HOUR * TIME.SECONDS_IN_MINUTE * TIME.MS_IN_SECOND; // 24 hours in milliseconds

const API = {
  VERIFY_ENDPOINT: '/api/turnstile/verify',
};

interface IVerificationState {
  verified: boolean;
  timestamp: number;
}

interface ITurnstileVerificationResult {
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  reset: () => void;
  verifyToken: (token: string) => Promise<boolean>;
}

/**
 * Hook to handle Turnstile verification
 */
export function useTurnstileVerification(): ITurnstileVerificationResult {
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = (): void => {
    setToken(null);
    setIsVerified(false);
    setError(null);

    // Check if verification is in localStorage and remove it
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE.KEY);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error clearing turnstile verification from localStorage', e);
    }
  };

  useEffect(() => {
    // Check if verification state exists in localStorage
    if (typeof window === 'undefined') {
      return; // Skip on server-side
    }

    try {
      const storedData = localStorage.getItem(STORAGE.KEY);
      if (!storedData) {
        return; // No stored data
      }

      const data = JSON.parse(storedData) as IVerificationState;
      const now = Date.now();

      // Check if the verification is still valid
      if (data.verified && now - data.timestamp < VERIFICATION_EXPIRY_TIME) {
        setIsVerified(true);
        return;
      }

      // Remove expired verification
      localStorage.removeItem(STORAGE.KEY);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error reading turnstile verification from localStorage', e);
    }
  }, []);

  // Verify token with server
  const verifyToken = async (newToken: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API.VERIFY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: newToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(newToken);
        setIsVerified(true);

        // Store verification state in localStorage
        try {
          const verificationState: IVerificationState = {
            verified: true,
            timestamp: Date.now(),
          };
          localStorage.setItem(STORAGE.KEY, JSON.stringify(verificationState));
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error saving verification state to localStorage', e);
        }

        return true;
      }

      // If we get here, verification failed
      setIsVerified(false);
      setError(data.error || 'Verification failed');
      reset();
      return false;
    } catch (e) {
      setIsVerified(false);
      setError('Network error during verification');
      reset();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isVerified,
    isLoading,
    error,
    token,
    reset,
    verifyToken,
  };
}
