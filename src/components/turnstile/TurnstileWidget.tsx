'use client';

import { useEffect, useRef } from 'react';

import type { ReactElement } from 'react';

interface ITurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (error: Error) => void;
  theme?: 'light' | 'dark' | 'auto';
}

interface ITurnstile {
  render: (container: HTMLElement, options: ITurnstileOptions) => string;
  reset: (widgetId: string) => void;
}

// Extend the Window interface globally
declare global {
  interface Window {
    turnstile?: ITurnstile;
  }
}

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
