import React from 'react';
import { cn } from '../../utils/cn';
import styles from './PricingCard.module.css';

// ─── PricingCard ─────────────────────────────────────────────────────────────

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether this plan is the recommended / popular tier */
  popular?: boolean;
  /** Layout density */
  variant?: 'default' | 'compact';
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ popular = false, variant = 'default', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          popular && styles.popular,
          variant === 'compact' && styles.compact,
          className,
        )}
        {...props}
      >
        {popular && (
          <span className={styles.popularBadge} aria-label="Most popular plan">
            Most Popular
          </span>
        )}
        {children}
      </div>
    );
  },
);
PricingCard.displayName = 'PricingCard';

// ─── PricingCardHeader ───────────────────────────────────────────────────────

export interface PricingCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name */
  plan: string;
  /** Short plan description */
  description?: string;
}

export const PricingCardHeader = React.forwardRef<HTMLDivElement, PricingCardHeaderProps>(
  ({ plan, description, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.header, className)} {...props}>
        <h3 className={styles.plan}>{plan}</h3>
        {description && <p className={styles.planDescription}>{description}</p>}
        {children}
      </div>
    );
  },
);
PricingCardHeader.displayName = 'PricingCardHeader';

// ─── PricingCardPrice ────────────────────────────────────────────────────────

export interface PricingCardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Price amount (e.g., "$29" or "$0") */
  amount: string;
  /** Billing period (e.g., "/month", "/year", "one-time") */
  period?: string;
}

export const PricingCardPrice = React.forwardRef<HTMLDivElement, PricingCardPriceProps>(
  ({ amount, period, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.price, className)} {...props}>
        <span className={styles.amount}>{amount}</span>
        {period && <span className={styles.period}>{period}</span>}
      </div>
    );
  },
);
PricingCardPrice.displayName = 'PricingCardPrice';

// ─── PricingCardFeatures ─────────────────────────────────────────────────────

export interface PricingCardFeaturesProps extends React.HTMLAttributes<HTMLUListElement> {}

export const PricingCardFeatures = React.forwardRef<HTMLUListElement, PricingCardFeaturesProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ul ref={ref} className={cn(styles.features, className)} {...props}>
        {children}
      </ul>
    );
  },
);
PricingCardFeatures.displayName = 'PricingCardFeatures';

// ─── PricingCardFeature ──────────────────────────────────────────────────────

export interface PricingCardFeatureProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Whether this feature is included in this plan */
  included?: boolean;
}

export const PricingCardFeature = React.forwardRef<HTMLLIElement, PricingCardFeatureProps>(
  ({ included = true, children, className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(styles.feature, !included && styles.featureExcluded, className)}
        {...props}
      >
        <span
          className={cn(
            styles.featureIcon,
            included ? styles.featureIncludedIcon : styles.featureExcludedIcon,
          )}
          aria-hidden="true"
        >
          {included ? '\u2713' : '\u2717'}
        </span>
        {children}
      </li>
    );
  },
);
PricingCardFeature.displayName = 'PricingCardFeature';

// ─── PricingCardAction ───────────────────────────────────────────────────────

export interface PricingCardActionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PricingCardAction = React.forwardRef<HTMLDivElement, PricingCardActionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.action, className)} {...props}>
        {children}
      </div>
    );
  },
);
PricingCardAction.displayName = 'PricingCardAction';
