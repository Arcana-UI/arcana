import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Hero.module.css';

// ─── Hero ────────────────────────────────────────────────────────────────────

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual layout variant */
  variant?: 'centered' | 'split' | 'fullscreen';
  /** Alignment of text content */
  align?: 'left' | 'center';
  /** Height of the hero section */
  height?: 'viewport' | 'large' | 'auto';
  /** Whether to apply a dark overlay for text readability over background media */
  overlay?: boolean;
}

export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      variant = 'centered',
      align = 'center',
      height = 'auto',
      overlay = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
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
        {overlay && <div className={styles.overlayBg} aria-hidden="true" />}
        <div className={styles.inner}>{children}</div>
      </section>
    );
  },
);
Hero.displayName = 'Hero';

// ─── HeroBadge ───────────────────────────────────────────────────────────────

export interface HeroBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const HeroBadge = React.forwardRef<HTMLSpanElement, HeroBadgeProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(styles.badge, className)} {...props}>
        {children}
      </span>
    );
  },
);
HeroBadge.displayName = 'HeroBadge';

// ─── HeroContent ─────────────────────────────────────────────────────────────

export interface HeroContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroContent = React.forwardRef<HTMLDivElement, HeroContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.content, className)} {...props}>
        {children}
      </div>
    );
  },
);
HeroContent.displayName = 'HeroContent';

// ─── HeroTitle ───────────────────────────────────────────────────────────────

export interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level */
  as?: 'h1' | 'h2' | 'h3';
}

export const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ as: Tag = 'h1', children, className, ...props }, ref) => {
    return (
      <Tag ref={ref} className={cn(styles.title, className)} {...props}>
        {children}
      </Tag>
    );
  },
);
HeroTitle.displayName = 'HeroTitle';

// ─── HeroDescription ────────────────────────────────────────────────────────

export interface HeroDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const HeroDescription = React.forwardRef<HTMLParagraphElement, HeroDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(styles.description, className)} {...props}>
        {children}
      </p>
    );
  },
);
HeroDescription.displayName = 'HeroDescription';

// ─── HeroActions ─────────────────────────────────────────────────────────────

export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.actions, className)} {...props}>
        {children}
      </div>
    );
  },
);
HeroActions.displayName = 'HeroActions';

// ─── HeroMedia ───────────────────────────────────────────────────────────────

export interface HeroMediaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroMedia = React.forwardRef<HTMLDivElement, HeroMediaProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.media, className)} {...props}>
        {children}
      </div>
    );
  },
);
HeroMedia.displayName = 'HeroMedia';
