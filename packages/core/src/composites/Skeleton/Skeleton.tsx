import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Width (CSS value) */
  width?: string;
  /** Height (CSS value) */
  height?: string;
  /** Number of text lines to render */
  lines?: number;
  /** Whether to animate the pulse effect */
  animate?: boolean;
  /** Border radius override */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Additional CSS class */
  className?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { variant = 'text', width, height, lines = 1, animate = true, radius, className, ...props },
    ref,
  ) => {
    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn(styles.textGroup, className)} aria-busy="true" {...props}>
          {Array.from({ length: lines }, (_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton lines have no stable ID
              key={i}
              aria-hidden="true"
              className={cn(
                styles.skeleton,
                styles.text,
                animate && styles.animate,
                i === lines - 1 && styles.lastLine,
              )}
              style={{ width: i === lines - 1 ? '80%' : width }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          styles.skeleton,
          styles[variant],
          animate && styles.animate,
          radius && styles[`radius-${radius}`],
          className,
        )}
        style={{ width, height }}
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';
