'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: (error: Error) => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
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
export function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = 'auto',
  className = '',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Wait for Turnstile to be loaded
    if (!window.turnstile || !containerRef.current) return;

    // Render the widget
    const id = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => {
        onVerify(token);
      },
      'expired-callback': onExpire,
      'error-callback': onError,
      theme,
    });

    widgetIdRef.current = id;

    // Clean up on unmount
    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };
  }, [siteKey, onVerify, onExpire, onError, theme]);

  return <div ref={containerRef} className={className} data-testid="turnstile-container" />;
}
