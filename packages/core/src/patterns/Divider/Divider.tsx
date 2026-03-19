import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Divider direction */
  orientation?: 'horizontal' | 'vertical';
  /** Line style */
  variant?: 'solid' | 'dashed' | 'dotted';
  /** Text or element displayed in the middle of the divider */
  label?: string | React.ReactNode;
  /** Spacing above and below (or left/right for vertical) */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    { orientation = 'horizontal', variant = 'solid', label, spacing = 'md', className, ...props },
    ref,
  ) => {
    if (label) {
      return (
        // biome-ignore lint/a11y/useFocusableInteractive: separator is non-interactive
        <div
          role="separator"
          aria-orientation={orientation}
          className={cn(styles.dividerWithLabel, styles[`spacing-${spacing}`], className)}
        >
          <span className={cn(styles.line, styles[`variant-${variant}`])} />
          <span className={styles.label}>{label}</span>
          <span className={cn(styles.line, styles[`variant-${variant}`])} />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        className={cn(
          styles.divider,
          styles[`orientation-${orientation}`],
          styles[`variant-${variant}`],
          styles[`spacing-${spacing}`],
          className,
        )}
        {...props}
      />
    );
  },
);
Divider.displayName = 'Divider';
