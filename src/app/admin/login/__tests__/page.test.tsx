import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import AdminLoginPage from '../page';


// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('/admin'),
    });
  });
  
  it('renders the login form', () => {
    render(<AdminLoginPage />);
    
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Email' })).toBeInTheDocument();
  });
  
  it('handles form submission', async () => {
    render(<AdminLoginPage />);
    
    // Fill in the email field
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Sign in with Email' });
    fireEvent.click(submitButton);
    
    // Check if signIn was called with correct parameters
    expect(signIn).toHaveBeenCalledWith('email', {
      email: 'admin@example.com',
      redirect: false,
      callbackUrl: '/admin',
    });
    
    // Check loading state
    expect(screen.getByText('Sending link...')).toBeInTheDocument();
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Check your email for a sign-in link.')).toBeInTheDocument();
    });
  });
  
  it('handles authentication error', async () => {
    // Mock signIn to return an error
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid email' });
    
    render(<AdminLoginPage />);
    
    // Fill in the email field
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Sign in with Email' });
    fireEvent.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Authentication failed. Please check your email and try again.')).toBeInTheDocument();
    });
  });
  
  it('handles unexpected errors', async () => {
    // Mock signIn to throw an error
    (signIn as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
    
    render(<AdminLoginPage />);
    
    // Fill in the email field
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Sign in with Email' });
    fireEvent.click(submitButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
