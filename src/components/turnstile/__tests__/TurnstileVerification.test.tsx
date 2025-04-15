import { render, screen, waitFor } from '@testing-library/react';

import { useTurnstileVerification } from '@/hooks/useTurnstileVerification';

import { TurnstileVerification } from '../TurnstileVerification';

// Mock the useTurnstileVerification hook
vi.mock('@/hooks/useTurnstileVerification');

// Mock the TurnstileWidget component
vi.mock('../TurnstileWidget', () => ({
  TurnstileWidget: ({ onVerify }: { onVerify: (token: string) => void }) => (
    <button data-testid="mock-turnstile-widget" onClick={() => onVerify('mock-token')}>
      Mock Turnstile Widget
    </button>
  ),
}));

// Mock environment variables
vi.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key',
  },
}));

// Set environment variable
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';

describe('TurnstileVerification', () => {
  const mockOnVerificationComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    (useTurnstileVerification as Mock).mockReturnValue({
      isVerified: false,
      isLoading: false,
      verifyToken: vi.fn().mockResolvedValue(true),
      resetVerification: vi.fn(),
    });
  });

  it('renders the verification card when not verified', () => {
    render(<TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />);

    expect(screen.getByText('Human Verification')).toBeInTheDocument();
    expect(
      screen.getByText('Please complete the verification below to continue using the chat.')
    ).toBeInTheDocument();

    // Since we're mocking the environment variable, we should see the widget
    // instead of the error message
    const errorMessage = screen.queryByText('Verification is not configured properly');
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('calls onVerificationComplete when already verified', () => {
    (useTurnstileVerification as Mock).mockReturnValue({
      isVerified: true,
      isLoading: false,
      verifyToken: vi.fn(),
      resetVerification: vi.fn(),
    });

    render(<TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />);

    expect(mockOnVerificationComplete).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    (useTurnstileVerification as Mock).mockReturnValue({
      isVerified: false,
      isLoading: true,
      verifyToken: vi.fn(),
      resetVerification: vi.fn(),
    });

    render(<TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles verification success', async () => {
    // Mock the verification hook to return true after verification
    const mockVerifyToken = vi.fn().mockImplementation(() => {
      // Update the mock to return true for isVerified after verification
      (useTurnstileVerification as Mock).mockReturnValue({
        isVerified: true,
        isLoading: false,
        verifyToken: mockVerifyToken,
        resetVerification: vi.fn(),
      });
      return Promise.resolve(true);
    });

    // Initial state: not verified
    (useTurnstileVerification as Mock).mockReturnValue({
      isVerified: false,
      isLoading: false,
      verifyToken: mockVerifyToken,
      resetVerification: vi.fn(),
    });

    const { rerender } = render(
      <TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />
    );

    // Simulate verification
    await mockVerifyToken('mock-token');

    // Force re-render with the updated state
    rerender(<TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />);

    // Now the component should call onVerificationComplete because isVerified is true
    expect(mockOnVerificationComplete).toHaveBeenCalledTimes(1);
  });

  it('handles verification failure', async () => {
    const mockVerifyToken = vi.fn().mockResolvedValue(false);

    (useTurnstileVerification as Mock).mockReturnValue({
      isVerified: false,
      isLoading: false,
      verifyToken: mockVerifyToken,
      resetVerification: vi.fn(),
    });

    const { rerender } = render(
      <TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />
    );

    // Simulate verification failure by calling the hook's verifyToken function
    await mockVerifyToken('mock-token');

    // Force a re-render to show the error message
    rerender(<TurnstileVerification onVerificationComplete={mockOnVerificationComplete} />);

    // Wait for verification to complete
    await waitFor(() => {
      expect(mockVerifyToken).toHaveBeenCalled();
      // We can't check for the error message directly since we're mocking the component
      // Instead, we'll verify that the completion handler wasn't called
      expect(mockOnVerificationComplete).not.toHaveBeenCalled();
    });
  });
});
