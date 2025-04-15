'use client';

import { useEffect, useRef } from 'react';

import type { ReactElement } from 'react';
import type { ITurnstileAPI } from '@/types/turnstile';

// We're using the ITurnstileOptions from the imported type

// Use the ITurnstileAPI interface from the global type definition
// Extend the Window interface globally
// We need to use Window (not IWindow) to extend the global Window interface
/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  interface Window {
    turnstile?: ITurnstileAPI;
  }
}
/* eslint-enable @typescript-eslint/naming-convention */

interface ITurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: Error) => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

/**
 * Cloudflare Turnstile CAPTCHA widget component
 *
 * This component renders a Cloudflare Turnstile widget for human verification.
 * It requires the Turnstile script to be loaded in the page.
 */
export const TurnstileWidget = ({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = 'auto',
  className = '',
}: ITurnstileWidgetProps): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Wait for Turnstile to be loaded
    if (!window.turnstile || !containerRef.current) {
      return;
    }

    // Render the widget
    const id = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string): void => {
        onVerify(token);
      },
      'expired-callback': onExpire,
      'error-callback': onError,
      theme,
    });

    widgetIdRef.current = id;

    // Clean up on unmount
    return (): void => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };
  }, [siteKey, onVerify, onExpire, onError, theme]);

  return <div ref={containerRef} className={className} data-testid="turnstile-container" />;
};
