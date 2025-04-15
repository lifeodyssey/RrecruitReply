/**
 * Type declarations for Cloudflare Turnstile
 */

export interface ITurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (error: Error) => void;
  theme?: 'light' | 'dark' | 'auto';
  tabindex?: number;
  size?: 'normal' | 'compact';
  action?: string;
  cData?: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
  execution?: 'render' | 'execute';
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  language?: string;
}

export interface ITurnstileAPI {
  render: (container: HTMLElement | string, options: ITurnstileOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
  getResponse: (widgetId: string) => string | undefined;
}

declare global {
  interface IWindow {
    turnstile?: ITurnstileAPI;
  }
}

export {};
