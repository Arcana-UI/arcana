import React, { useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './Hero.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface HeroCTAAction {
  /** Button/link label text */
  label: string;
  /** URL for link-based CTA */
  href?: string;
  /** Click handler for button-based CTA */
  onClick?: () => void;
}

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Main headline text (rendered as h1) */
  headline: string;
  /** Supporting text below the headline */
  subheadline?: string;
  /** Primary call-to-action button/link */
  primaryCTA?: HeroCTAAction;
  /** Secondary call-to-action button/link */
  secondaryCTA?: HeroCTAAction;
  /** Media element (image, video, or illustration) for split/fullscreen variants */
  media?: React.ReactNode;
  /** Layout variant */
  variant?: 'centered' | 'split' | 'fullscreen';
  /** Text alignment (only applies to centered variant) */
  align?: 'left' | 'center';
  /** Height behavior */
  height?: 'viewport' | 'large' | 'auto';
  /** Adds a semi-transparent dark overlay for text readability over media */
  overlay?: boolean;
  /** Small announcement badge displayed above the headline */
  badge?: string;
}

// ─── Hero ───────────────────────────────────────────────────────────────────

export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      headline,
      subheadline,
      primaryCTA,
      secondaryCTA,
      media,
      variant = 'centered',
      align = 'center',
      height = 'auto',
      overlay = false,
      badge,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const headlineId = `${id}-headline`;

    const renderCTA = (cta: HeroCTAAction, isPrimary: boolean): React.ReactNode => {
      const ctaClass = isPrimary ? styles.ctaPrimary : styles.ctaSecondary;
      if (cta.href) {
        return (
          <a key={cta.label} href={cta.href} className={ctaClass}>
            {cta.label}
          </a>
        );
      }
      return (
        <button key={cta.label} type="button" onClick={cta.onClick} className={ctaClass}>
          {cta.label}
        </button>
      );
    };

    const hasActions = primaryCTA || secondaryCTA;

    return (
      <section
        ref={ref}
        aria-labelledby={headlineId}
        className={cn(
          styles.hero,
          styles[variant],
          align === 'left' && styles.alignLeft,
          height === 'viewport' && styles.heightViewport,
          height === 'large' && styles.heightLarge,
          overlay && styles.overlay,
          className,
        )}
        {...props}
      >
        {overlay && variant === 'fullscreen' && (
          <div className={styles.overlayBg} aria-hidden="true" />
        )}
        <div className={styles.content}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <h1 id={headlineId} className={styles.headline}>
            {headline}
          </h1>
          {subheadline && <p className={styles.subheadline}>{subheadline}</p>}
          {hasActions && (
            <div className={styles.actions}>
              {primaryCTA && renderCTA(primaryCTA, true)}
              {secondaryCTA && renderCTA(secondaryCTA, false)}
            </div>
          )}
          {children}
        </div>
        {media && <div className={styles.media}>{media}</div>}
      </section>
    );
  },
);
Hero.displayName = 'Hero';
