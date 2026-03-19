import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Spinner.module.css';

const SIZES: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant — "current" inherits parent text color */
  color?: 'primary' | 'current' | 'white';
  /** Accessible label (visually hidden) */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color = 'primary', label = 'Loading', className, ...props }, ref) => {
    const px = SIZES[size];

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(styles.spinner, styles[`color-${color}`], className)}
        {...props}
      >
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className={styles.track}
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            className={styles.indicator}
          />
        </svg>
        <span className={styles.srOnly}>{label}</span>
      </div>
    );
  },
);
Spinner.displayName = 'Spinner';
