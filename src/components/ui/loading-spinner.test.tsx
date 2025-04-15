import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingSpinner from './loading-spinner';

describe('LoadingSpinner', () => {
  it('renders correctly with default props', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('h-8 w-8 border-3'); // md size
    expect(spinner).toHaveClass('border-primary/30 border-t-primary'); // primary variant

    const srText = screen.getByText('Loading...');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });

  it('applies the correct size class based on size prop', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-4 w-4 border-2');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-8 w-8 border-3');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-12 w-12 border-4');
  });

  it('applies the correct variant class based on variant prop', () => {
    const { rerender } = render(<LoadingSpinner variant="primary" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('border-primary/30 border-t-primary');

    rerender(<LoadingSpinner variant="secondary" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass(
      'border-secondary/30 border-t-secondary'
    );

    rerender(<LoadingSpinner variant="accent" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('border-accent/30 border-t-accent');
  });

  it('merges additional className prop correctly', () => {
    render(<LoadingSpinner className="test-class" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('test-class');
  });

  it('passes additional props to the div element', () => {
    render(<LoadingSpinner data-custom="test-value" />);
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute('data-custom', 'test-value');
  });
});
