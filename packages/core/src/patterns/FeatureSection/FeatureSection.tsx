import React, { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './FeatureSection.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FeatureItemData {
  /** Icon element displayed above or beside the title */
  icon?: React.ReactNode;
  /** Feature title text */
  title: string;
  /** Feature description text */
  description: string;
  /** Optional link for the feature */
  link?: { label: string; href: string };
}

export interface FeatureSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section heading */
  title?: string;
  /** Section description displayed below the title */
  subtitle?: string;
  /** Array of feature items to display */
  features: FeatureItemData[];
  /** Number of columns in the grid layout (desktop) */
  columns?: 2 | 3 | 4;
  /** Layout variant */
  variant?: 'grid' | 'list' | 'alternating';
}

// ─── FeatureSection ─────────────────────────────────────────────────────────

export const FeatureSection = React.forwardRef<HTMLElement, FeatureSectionProps>(
  (
    { title, subtitle, features, columns = 3, variant = 'grid', className, children, ...props },
    ref,
  ) => {
    const id = useId();
    const titleId = title ? `${id}-title` : undefined;

    return (
      <section
        ref={ref}
        className={cn(styles.section, className)}
        aria-labelledby={titleId}
        {...props}
      >
        {(title || subtitle) && (
          <div className={styles.header}>
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
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                variant === 'grid' && styles.card,
                variant === 'list' && styles.listItem,
                variant === 'alternating' && styles.altItem,
                variant === 'alternating' && index % 2 !== 0 && styles.altReverse,
              )}
            >
              {feature.icon && (
                <div className={styles.icon} aria-hidden="true">
                  {feature.icon}
                </div>
              )}
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>{feature.title}</h3>
                <p className={styles.itemDescription}>{feature.description}</p>
                {feature.link && (
                  <a href={feature.link.href} className={styles.itemLink}>
                    {feature.link.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {children}
      </section>
    );
  },
);
FeatureSection.displayName = 'FeatureSection';
