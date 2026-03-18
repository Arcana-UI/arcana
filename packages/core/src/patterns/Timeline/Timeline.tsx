import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Timeline.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TimelineItemData {
  /** Item title text */
  title: string;
  /** Item description text */
  description: string;
  /** Date or time label */
  date?: string;
  /** Custom icon element for the timeline dot */
  icon?: React.ReactNode;
  /** Status of this timeline item */
  status?: 'complete' | 'active' | 'pending';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of timeline items */
  items: TimelineItemData[];
  /** Layout variant */
  variant?: 'standard' | 'compact' | 'alternating';
}

// ─── Timeline ───────────────────────────────────────────────────────────────

export const Timeline = React.forwardRef<HTMLElement, TimelineProps>(
  ({ items, variant = 'standard', className, children, ...props }, ref) => {
    return (
      <nav ref={ref} className={cn(styles.timeline, styles[variant], className)} {...props}>
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className={cn(
                styles.item,
                variant === 'alternating' && index % 2 !== 0 && styles.altReverse,
              )}
            >
              <div className={styles.indicator}>
                <div
                  className={cn(
                    styles.dot,
                    item.status === 'complete' && styles.dotComplete,
                    item.status === 'active' && styles.dotActive,
                    item.status === 'pending' && styles.dotPending,
                    !item.status && styles.dotComplete,
                  )}
                  aria-hidden="true"
                >
                  {item.icon || (item.status === 'complete' ? '\u2713' : null)}
                </div>
                {index < items.length - 1 && <div className={styles.line} aria-hidden="true" />}
              </div>
              <div className={styles.content}>
                {item.date && <time className={styles.date}>{item.date}</time>}
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
        {children}
      </nav>
    );
  },
);
Timeline.displayName = 'Timeline';
