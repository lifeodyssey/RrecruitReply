import React, { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface ILoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent';
}

/**
 * A loading spinner component with customizable size and variant.
 * @param size - Size of the spinner: sm, md, or lg
 * @param variant - Color variant: primary, secondary, or accent
 * @param className - Additional CSS classes
 */
const LoadingSpinner = ({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: ILoadingSpinnerProps): React.ReactElement => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const variantClasses = {
    primary: 'border-primary/30 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    accent: 'border-accent/30 border-t-accent',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
      data-testid="loading-spinner"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
