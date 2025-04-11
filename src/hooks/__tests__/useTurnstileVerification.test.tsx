import { renderHook, act, waitFor } from '@testing-library/react';
import { useTurnstileVerification } from '../useTurnstileVerification';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock fetch
global.fetch = jest.fn();

describe('useTurnstileVerification', () => {
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Default fetch mock implementation
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: true }),
    });
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
    
    expect(result.current.isVerified).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('turnstile-verification');
  });
  
  it('verifies token successfully', async () => {
    const { result } = renderHook(() => useTurnstileVerification());
    
    // Verify a token
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.verifyToken('mock-token');
    });
    
    // Check results
    expect(success).toBe(true);
    expect(result.current.isVerified).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/turnstile/verify', expect.any(Object));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'turnstile-verification',
      expect.any(String)
    );
  });
  
  it('handles verification failure', async () => {
    // Mock fetch to return failure
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ success: false }),
    });
    
    const { result } = renderHook(() => useTurnstileVerification());
    
    // Verify a token
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.verifyToken('mock-token');
    });
    
    // Check results
    expect(success).toBe(false);
    expect(result.current.isVerified).toBe(false);
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });
  
  it('resets verification state', () => {
    // Set up localStorage with a valid verification
    mockLocalStorage.setItem(
      'turnstile-verification',
      JSON.stringify({ verified: true, timestamp: Date.now() })
    );
    
    const { result } = renderHook(() => useTurnstileVerification());
    
    // Initial state should be verified
    expect(result.current.isVerified).toBe(true);
    
    // Reset verification
    act(() => {
      result.current.resetVerification();
    });
    
    // State should be reset
    expect(result.current.isVerified).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('turnstile-verification');
  });
});
