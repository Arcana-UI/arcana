import React, { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './CTA.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CTAAction {
  /** Button/link label text */
  label: string;
  /** URL for link-based CTA */
  href?: string;
  /** Click handler for button-based CTA */
  onClick?: () => void;
}

export interface CTAProps extends React.HTMLAttributes<HTMLElement> {
  /** Main headline text */
  headline: string;
  /** Supporting description text */
  description?: string;
  /** Primary call-to-action button/link */
  primaryCTA?: CTAAction;
  /** Secondary call-to-action button/link */
  secondaryCTA?: CTAAction;
  /** Visual variant */
  variant?: 'banner' | 'card' | 'minimal';
}

// ─── CTA ────────────────────────────────────────────────────────────────────

export const CTA = React.forwardRef<HTMLElement, CTAProps>(
  (
    {
      headline,
      description,
      primaryCTA,
      secondaryCTA,
      variant = 'banner',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const headlineId = `${id}-headline`;

    const renderAction = (action: CTAAction, isPrimary: boolean): React.ReactNode => {
      const actionClass = isPrimary ? styles.ctaPrimary : styles.ctaSecondary;
      if (action.href) {
        return (
          <a key={action.label} href={action.href} className={actionClass}>
            {action.label}
          </a>
        );
      }
      return (
        <button key={action.label} type="button" onClick={action.onClick} className={actionClass}>
          {action.label}
        </button>
      );
    };

    const hasActions = primaryCTA || secondaryCTA;

    return (
      <section
        ref={ref}
        className={cn(styles.cta, styles[variant], className)}
        aria-label={headline}
        {...props}
      >
        <div className={styles.inner}>
          <h2 id={headlineId} className={styles.headline}>
            {headline}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
          {hasActions && (
            <div className={styles.actions}>
              {primaryCTA && renderAction(primaryCTA, true)}
              {secondaryCTA && renderAction(secondaryCTA, false)}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  },
);
CTA.displayName = 'CTA';
