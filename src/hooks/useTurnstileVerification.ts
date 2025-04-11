'use client';

import { useState, useEffect } from 'react';

const VERIFICATION_STORAGE_KEY = 'turnstile-verification';
const VERIFICATION_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

interface VerificationState {
  verified: boolean;
  timestamp: number;
}

/**
 * Hook to manage Turnstile verification state
 * 
 * This hook manages the verification state of the Turnstile CAPTCHA,
 * including persisting the state to localStorage and handling expiration.
 */
export function useTurnstileVerification() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load verification state from localStorage on mount
  useEffect(() => {
    const storedVerification = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    
    if (storedVerification) {
      try {
        const state = JSON.parse(storedVerification) as VerificationState;
        const now = Date.now();
        
        // Check if verification is still valid
        if (state.verified && now - state.timestamp < VERIFICATION_EXPIRY_TIME) {
          setIsVerified(true);
        } else {
          // Clear expired verification
          localStorage.removeItem(VERIFICATION_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing verification state:', error);
        localStorage.removeItem(VERIFICATION_STORAGE_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Function to verify a Turnstile token
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/turnstile/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store verification state in localStorage
        const verificationState: VerificationState = {
          verified: true,
          timestamp: Date.now(),
        };
        
        localStorage.setItem(
          VERIFICATION_STORAGE_KEY,
          JSON.stringify(verificationState)
        );
        
        setIsVerified(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset verification state
  const resetVerification = () => {
    localStorage.removeItem(VERIFICATION_STORAGE_KEY);
    setIsVerified(false);
  };

  return {
    isVerified,
    isLoading,
    verifyToken,
    resetVerification,
  };
}
