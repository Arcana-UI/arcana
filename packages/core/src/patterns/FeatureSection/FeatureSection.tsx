import React, { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './FeatureSection.module.css';

// ─── FeatureSection ──────────────────────────────────────────────────────────

export interface FeatureSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section title displayed above the features */
  title?: string;
  /** Section subtitle / description */
  subtitle?: string;
  /** Number of columns for grid variant */
  columns?: 2 | 3 | 4;
  /** Layout variant */
  variant?: 'grid' | 'list' | 'alternating';
}

export const FeatureSection = React.forwardRef<HTMLElement, FeatureSectionProps>(
  ({ title, subtitle, columns = 3, variant = 'grid', children, className, ...props }, ref) => {
    const titleId = useId();

    return (
      <section
        ref={ref}
        className={cn(styles.section, className)}
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        {(title || subtitle) && (
          <div className={styles.sectionHeader}>
            {title && (
              <h2 id={titleId} className={styles.sectionTitle}>
                {title}
              </h2>
            )}
            {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
          </div>
        )}
        <div
          className={cn(
            variant === 'grid' && styles.grid,
            variant === 'grid' && styles[`cols${columns}`],
            variant === 'list' && styles.list,
            variant === 'alternating' && styles.alternating,
          )}
        >
          {children}
        </div>
      </section>
    );
  },
);
FeatureSection.displayName = 'FeatureSection';

// ─── FeatureItem ─────────────────────────────────────────────────────────────

export interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element displayed above (grid) or beside (list) the title */
  icon?: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description?: string;
  /** Optional link at the bottom of the feature */
  link?: { label: string; href: string };
}

export const FeatureItem = React.forwardRef<HTMLDivElement, FeatureItemProps>(
  ({ icon, title, description, link, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.item, className)} {...props}>
        {icon && (
          <div className={styles.icon} aria-hidden="true">
            {icon}
          </div>
        )}
        <div className={styles.itemContent}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
          {link && (
            <a href={link.href} className={styles.link}>
              {link.label}
              <span aria-hidden="true"> &rarr;</span>
            </a>
          )}
          {children}
        </div>
      </div>
    );
  },
);
FeatureItem.displayName = 'FeatureItem';
