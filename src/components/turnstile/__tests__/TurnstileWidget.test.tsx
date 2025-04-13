import { render, screen } from '@testing-library/react';

import { TurnstileWidget } from '../TurnstileWidget';

// Mock the turnstile global object
const mockRender = jest.fn().mockReturnValue('widget-id-123');
const mockReset = jest.fn();

beforeEach(() => {
  // Setup the mock
  window.turnstile = {
    render: mockRender,
    reset: mockReset,
  };
});

afterEach(() => {
  // Clean up
  jest.clearAllMocks();
  delete window.turnstile;
});

describe('TurnstileWidget', () => {
  const mockProps = {
    siteKey: 'test-site-key',
    onVerify: jest.fn(),
    onExpire: jest.fn(),
    onError: jest.fn(),
    theme: 'auto' as const,
  };

  it('renders a container for the Turnstile widget', () => {
    render(<TurnstileWidget {...mockProps} />);

    // The component should render a div container
    const container = screen.getByTestId('turnstile-container');
    expect(container).toBeInTheDocument();
  });

  it('calls turnstile.render with correct parameters', () => {
    render(<TurnstileWidget {...mockProps} />);

    // Check if turnstile.render was called with the correct parameters
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender.mock.calls[0][1]).toMatchObject({
      sitekey: mockProps.siteKey,
      theme: mockProps.theme,
    });
  });

  it('calls render when mounted', () => {
    // Render the component
    render(<TurnstileWidget {...mockProps} />);

    // Check if turnstile.render was called
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender.mock.calls[0][1]).toMatchObject({
      sitekey: mockProps.siteKey,
      theme: mockProps.theme,
    });
  });
});
