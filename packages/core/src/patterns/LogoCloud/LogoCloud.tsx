import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './LogoCloud.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LogoItem {
  /** Image source URL */
  src: string;
  /** Alt text for the logo image (required for accessibility) */
  alt: string;
  /** Optional link URL */
  href?: string;
}

export interface LogoCloudProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of logo items to display */
  logos: LogoItem[];
  /** Optional section title (e.g., "Trusted by") */
  title?: string;
  /** Layout variant */
  variant?: 'grid' | 'marquee' | 'fade';
}

// ─── LogoCloud ──────────────────────────────────────────────────────────────

export const LogoCloud = React.forwardRef<HTMLElement, LogoCloudProps>(
  ({ logos, title, variant = 'grid', className, children, ...props }, ref) => {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent): void => setReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }, []);

    // If reduced motion and marquee/fade, fall back to grid
    const effectiveVariant = reducedMotion && variant !== 'grid' ? 'grid' : variant;

    const renderLogo = (logo: LogoItem, index: number): React.ReactNode => {
      const img = <img src={logo.src} alt={logo.alt} className={styles.logoImage} loading="lazy" />;

      if (logo.href) {
        return (
          <a
            key={`${logo.alt}-${index}`}
            href={logo.href}
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {img}
          </a>
        );
      }

      return (
        <div key={`${logo.alt}-${index}`} className={styles.logoItem}>
          {img}
        </div>
      );
    };

    return (
      <section ref={ref} className={cn(styles.logoCloud, className)} {...props}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {effectiveVariant === 'grid' && (
          <div className={styles.grid}>{logos.map((logo, i) => renderLogo(logo, i))}</div>
        )}
        {effectiveVariant === 'marquee' && (
          <div className={styles.marqueeContainer} aria-hidden="false">
            <div className={styles.marqueeTrack}>
              {logos.map((logo, i) => renderLogo(logo, i))}
              {/* Duplicate for seamless loop */}
              {logos.map((logo, i) => renderLogo(logo, i + logos.length))}
            </div>
          </div>
        )}
        {effectiveVariant === 'fade' && (
          <div className={styles.fadeContainer}>
            {logos.map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className={styles.fadeItem}
                style={{ animationDelay: `${i * 2}s` }}
              >
                {renderLogo(logo, i)}
              </div>
            ))}
          </div>
        )}
        {children}
      </section>
    );
  },
);
LogoCloud.displayName = 'LogoCloud';
