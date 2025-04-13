import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

import { AuthProvider } from '../AuthProvider';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  SessionProvider: jest.fn(({ children }) => <div data-testid="session-provider">{children}</div>),
}));

describe('AuthProvider', () => {
  it('renders SessionProvider with children', () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    expect(getByTestId('session-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('passes props to SessionProvider', () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    // Check that SessionProvider was called with children
    expect(SessionProvider).toHaveBeenCalled();

    // Get the first call arguments
    const callArgs = (SessionProvider as jest.Mock).mock.calls[0][0];

    // Check that children prop exists
    expect(callArgs).toHaveProperty('children');
  });
});
