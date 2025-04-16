import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { vi } from 'vitest';

import { AuthProvider } from '../AuthProvider';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  SessionProvider: vi.fn(({ children }) => <div data-testid="session-provider">{children}</div>),
}));

// Get the mocked function with the correct type
const MockSessionProvider = vi.mocked(SessionProvider);

describe('AuthProvider', () => {
  it('renders SessionProvider with children', () => {
    // Reset mock counts before test
    MockSessionProvider.mockClear();

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    // Check that SessionProvider was called
    expect(MockSessionProvider).toHaveBeenCalled();
    // We can't check for the text directly because the mock doesn't render children
    // Instead, we verify that the mock was called with the correct children prop
    expect(MockSessionProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        children: <div>Test Child</div>
      }),
      expect.anything()
    );
  });

  it('passes props to SessionProvider', () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );

    // Check that SessionProvider was called with children
    expect(MockSessionProvider).toHaveBeenCalled();

    // Get the first call arguments
    const callArgs = MockSessionProvider.mock.calls[0][0];

    // Check that children prop exists
    expect(callArgs).toHaveProperty('children');
  });
});
