import React from 'react';
import { cn } from '../../utils/cn';
import styles from './PricingCard.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PricingFeature {
  /** Feature description text */
  label: string;
  /** Whether this feature is included in the plan */
  included: boolean;
}

export interface PricingCTAAction {
  /** Button/link label text */
  label: string;
  /** URL for link-based CTA */
  href?: string;
  /** Click handler for button-based CTA */
  onClick?: () => void;
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan/tier name (e.g., "Pro", "Enterprise") */
  name: string;
  /** Price amount — displayed as-is if string, or formatted as number */
  price: string | number;
  /** Billing period text (e.g., "/month", "/year", "one-time") */
  period?: string;
  /** Short plan description */
  description?: string;
  /** List of features with included/excluded status */
  features?: PricingFeature[];
  /** Call-to-action button/link */
  cta?: PricingCTAAction;
  /** Highlights this tier as recommended (badge + elevated styling) */
  popular?: boolean;
  /** Visual density variant */
  variant?: 'default' | 'compact';
}

// ─── PricingCard ────────────────────────────────────────────────────────────

export const PricingCard = React.forwardRef<HTMLElement, PricingCardProps>(
  (
    {
      name,
      price,
      period,
      description,
      features,
      cta,
      popular = false,
      variant = 'default',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const priceDisplay = typeof price === 'number' ? `$${price}` : price;

    const renderCTA = (action: PricingCTAAction): React.ReactNode => {
      const ctaClass = cn(styles.cta, popular && styles.ctaPopular);
      if (action.href) {
        return (
          <a href={action.href} className={ctaClass}>
            {action.label}
          </a>
        );
      }
      return (
        <button type="button" onClick={action.onClick} className={ctaClass}>
          {action.label}
        </button>
      );
    };

    return (
      <article
        ref={ref}
        className={cn(
          styles.card,
          popular && styles.popular,
          variant === 'compact' && styles.compact,
          className,
        )}
        aria-label={`${name} pricing plan`}
        {...props}
      >
        {popular && (
          <span className={styles.popularBadge} aria-label="Most popular plan">
            Most Popular
          </span>
        )}
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.priceSection}>
          <span className={styles.priceValue}>{priceDisplay}</span>
          {period && <span className={styles.period}>{period}</span>}
        </div>
        {features && features.length > 0 && (
          <ul className={styles.features} aria-label={`${name} plan features`}>
            {features.map((feature) => (
              <li
                key={feature.label}
                className={cn(styles.feature, !feature.included && styles.featureExcluded)}
              >
                <span className={styles.featureIcon} aria-hidden="true">
                  {feature.included ? '\u2713' : '\u2715'}
                </span>
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        )}
        {cta && <div className={styles.action}>{renderCTA(cta)}</div>}
        {children}
      </article>
    );
  },
);
PricingCard.displayName = 'PricingCard';
