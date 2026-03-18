import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Testimonial.module.css';

// ─── Testimonial ────────────────────────────────────────────────────────────

export interface TestimonialProps extends React.HTMLAttributes<HTMLElement> {
  /** The testimonial quote text */
  quote: string;
  /** Author's full name */
  author: string;
  /** Author's job title or role */
  jobTitle?: string;
  /** Author's company or organization */
  company?: string;
  /** URL of the author's avatar image */
  avatar?: string;
  /** Layout variant */
  variant?: 'card' | 'inline' | 'featured';
  /** Star rating from 1 to 5 */
  rating?: number;
}

export const Testimonial = React.forwardRef<HTMLElement, TestimonialProps>(
  (
    {
      quote,
      author,
      jobTitle,
      company,
      avatar,
      variant = 'card',
      rating,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const attribution = [jobTitle, company].filter(Boolean).join(', ');

    const renderStars = (count: number): React.ReactNode => {
      const clamped = Math.max(1, Math.min(5, Math.round(count)));
      return (
        <div className={styles.stars} role="img" aria-label={`Rated ${clamped} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={`star-${i}`}
              className={cn(styles.star, i < clamped && styles.starFilled)}
              aria-hidden="true"
            >
              {'\u2605'}
            </span>
          ))}
        </div>
      );
    };

    return (
      <figure ref={ref} className={cn(styles.testimonial, styles[variant], className)} {...props}>
        {rating !== undefined && renderStars(rating)}
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{quote}</p>
        </blockquote>
        <figcaption className={styles.attribution}>
          {avatar && <img src={avatar} alt="" className={styles.avatar} aria-hidden="true" />}
          <div className={styles.authorInfo}>
            <cite className={styles.authorName}>{author}</cite>
            {attribution && <span className={styles.authorRole}>{attribution}</span>}
          </div>
        </figcaption>
        {children}
      </figure>
    );
  },
);
Testimonial.displayName = 'Testimonial';
