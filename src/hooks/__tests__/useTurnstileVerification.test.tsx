import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import the actual hook
import { useTurnstileVerification } from '../useTurnstileVerification';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

describe('useTurnstileVerification', () => {
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    vi.clearAllMocks();
    mockLocalStorage.clear();

    // Setup fetch mock for this specific test
    global.fetch = vi.fn().mockImplementation(
      async () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => Promise.resolve({ success: true }),
        }) as unknown as Response
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTurnstileVerification());
    
    expect(result.current.isVerified).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('loads verification state from localStorage', () => {
    // Set up localStorage with a valid verification
    const now = Date.now();
    mockLocalStorage.setItem(
      'turnstile-verification',
      JSON.stringify({ verified: true, timestamp: now })
    );

    const { result } = renderHook(() => useTurnstileVerification());
    
    // Verify localStorage is being used correctly
    expect(result.current.isVerified).toBe(true);
  });

  it('ignores expired verification in localStorage', () => {
    // Set up localStorage with an expired verification (25 hours ago)
    const expired = Date.now() - 25 * 60 * 60 * 1000;
    mockLocalStorage.setItem(
      'turnstile-verification',
      JSON.stringify({ verified: true, timestamp: expired })
    );

    const { result } = renderHook(() => useTurnstileVerification());
    
    // Verify expired verification is handled correctly
    expect(result.current.isVerified).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('turnstile-verification');
  });

  it('verifies token successfully', async () => {
    const { result } = renderHook(() => useTurnstileVerification());

    // Verify a token
    await act(async () => {
      await result.current.verifyToken('mock-token');
    });

    // Check results
    expect(result.current.isVerified).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/turnstile/verify', expect.any(Object));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'turnstile-verification',
      expect.any(String)
    );
  });

  it('handles verification failure', async () => {
    // Mock fetch to return failure
    vi.mocked(global.fetch).mockImplementation(
      async () =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: async () => Promise.resolve({ success: false }),
        }) as unknown as Response
    );

    const { result } = renderHook(() => useTurnstileVerification());

    // Verify a token
    await act(async () => {
      await result.current.verifyToken('mock-token');
    });

    // Check results
    expect(result.current.isVerified).toBe(false);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('resets verification state', async () => {
    // Set up localStorage with a valid verification
    mockLocalStorage.setItem(
      'turnstile-verification',
      JSON.stringify({ verified: true, timestamp: Date.now() })
    );

    const { result } = renderHook(() => useTurnstileVerification());
    
    expect(result.current.isVerified).toBe(true);

    // Reset verification
    act(() => {
      result.current.reset();
    });

    // Verify reset functionality works correctly
    expect(result.current.isVerified).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('turnstile-verification');
  });
});
