import React from 'react';
import { cn } from '../../utils/cn';
import styles from './AspectRatio.module.css';

const PRESETS: Record<string, number> = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  wide: 21 / 9,
};

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio — preset name or numeric width/height ratio */
  ratio?: number | 'square' | 'video' | 'portrait' | 'wide';
  /** Content to constrain */
  children?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 'video', children, className, style, ...props }, ref) => {
    const numericRatio = typeof ratio === 'number' ? ratio : (PRESETS[ratio] ?? 16 / 9);

    return (
      <div
        ref={ref}
        className={cn(styles.aspectRatio, className)}
        style={{ ...style, aspectRatio: `${numericRatio}` }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
AspectRatio.displayName = 'AspectRatio';
