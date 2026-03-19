import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Spacer.module.css';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spacing size mapped to spacing tokens */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'section';
  /** Direction of spacing */
  axis?: 'vertical' | 'horizontal';
  /** Additional CSS class */
  className?: string;
}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = 'md', axis = 'vertical', className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(styles.spacer, styles[`${axis}-${size}`], className)}
      {...props}
    />
  ),
);
Spacer.displayName = 'Spacer';
