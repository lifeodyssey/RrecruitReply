'use client';

import { useState, useEffect } from 'react';

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
  TIME.HOURS_IN_DAY * 
  TIME.MINUTES_IN_HOUR * 
  TIME.SECONDS_IN_MINUTE * 
  TIME.MS_IN_SECOND; // 24 hours in milliseconds

const API = {
  VERIFY_ENDPOINT: '/api/turnstile/verify',
};

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
    const storedVerification = localStorage.getItem(STORAGE.KEY);
    
    if (storedVerification) {
      try {
        const state = JSON.parse(storedVerification) as VerificationState;
        const now = Date.now();
        
        // Check if verification is still valid
        if (state.verified && now - state.timestamp < VERIFICATION_EXPIRY_TIME) {
          setIsVerified(true);
        } else {
          // Clear expired verification
          localStorage.removeItem(STORAGE.KEY);
        }
      } catch (error) {
        console.error('Error parsing verification state:', error);
        localStorage.removeItem(STORAGE.KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Function to verify a Turnstile token
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(API.VERIFY_ENDPOINT, {
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
          STORAGE.KEY,
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
    localStorage.removeItem(STORAGE.KEY);
    setIsVerified(false);
  };

  return {
    isVerified,
    isLoading,
    verifyToken,
    resetVerification,
  };
}
