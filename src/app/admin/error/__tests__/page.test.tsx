import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import AuthErrorPage from '../page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

describe('AuthErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
  });

  it('renders default error message when no error code is provided', () => {
    render(<AuthErrorPage />);

    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(
      screen.getByText('An error occurred during authentication. Please try again.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to Login' })).toBeInTheDocument();
  });

  it('renders access denied error message', () => {
    // Mock error code
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('AccessDenied'),
    });

    render(<AuthErrorPage />);

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByText('You do not have permission to access this resource.')
    ).toBeInTheDocument();
  });

  it('renders verification error message', () => {
    // Mock error code
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('Verification'),
    });

    render(<AuthErrorPage />);

    expect(screen.getByText('Verification Error')).toBeInTheDocument();
    expect(
      screen.getByText('The verification link is invalid or has expired.')
    ).toBeInTheDocument();
  });

  it('renders configuration error message', () => {
    // Mock error code
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('Configuration'),
    });

    render(<AuthErrorPage />);

    expect(screen.getByText('Configuration Error')).toBeInTheDocument();
    expect(
      screen.getByText('There is a problem with the authentication configuration.')
    ).toBeInTheDocument();
  });

  it('renders email sign-in error message', () => {
    // Mock error code
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('EmailSignin'),
    });

    render(<AuthErrorPage />);

    expect(screen.getByText('Email Sign-in Error')).toBeInTheDocument();
    expect(
      screen.getByText('The email could not be sent. Please try again later.')
    ).toBeInTheDocument();
  });
});
