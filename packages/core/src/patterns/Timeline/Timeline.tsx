import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Timeline.module.css';

// ─── Timeline ────────────────────────────────────────────────────────────────

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Layout variant */
  variant?: 'standard' | 'compact' | 'alternating';
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ variant = 'standard', children, className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn(
          styles.timeline,
          variant === 'compact' && styles.compact,
          variant === 'alternating' && styles.alternating,
          className,
        )}
        {...props}
      >
        {children}
      </ol>
    );
  },
);
Timeline.displayName = 'Timeline';

// ─── TimelineItem ────────────────────────────────────────────────────────────

export interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Title of the timeline entry */
  title?: string;
  /** Date or time label */
  date?: string;
  /** Icon to display in the dot */
  icon?: React.ReactNode;
  /** Status of this timeline entry */
  status?: 'complete' | 'active' | 'pending';
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ title, date, icon, status = 'complete', children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn(styles.item, className)} {...props}>
        <div className={styles.indicator}>
          <div
            className={cn(
              styles.dot,
              styles[`dot${status.charAt(0).toUpperCase()}${status.slice(1)}`],
            )}
            aria-hidden="true"
          >
            {icon || (status === 'complete' && <span className={styles.checkIcon}>&#10003;</span>)}
          </div>
          <div className={styles.line} aria-hidden="true" />
        </div>
        <div className={styles.content}>
          {date && <time className={styles.date}>{date}</time>}
          {title && <h3 className={styles.itemTitle}>{title}</h3>}
          {children && <div className={styles.body}>{children}</div>}
        </div>
      </li>
    );
  },
);
TimelineItem.displayName = 'TimelineItem';
