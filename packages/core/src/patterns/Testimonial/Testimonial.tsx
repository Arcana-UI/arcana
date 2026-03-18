import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Testimonial.module.css';

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface TestimonialProps extends React.HTMLAttributes<HTMLElement> {
  /** Layout variant */
  variant?: 'card' | 'inline' | 'featured';
}

export const Testimonial = React.forwardRef<HTMLElement, TestimonialProps>(
  ({ variant = 'card', children, className, ...props }, ref) => {
    return (
      <figure
        ref={ref}
        className={cn(
          styles.testimonial,
          variant === 'inline' && styles.inline,
          variant === 'featured' && styles.featured,
          className,
        )}
        {...props}
      >
        {children}
      </figure>
    );
  },
);
Testimonial.displayName = 'Testimonial';

// ─── TestimonialQuote ────────────────────────────────────────────────────────

export interface TestimonialQuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}

export const TestimonialQuote = React.forwardRef<HTMLQuoteElement, TestimonialQuoteProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <blockquote ref={ref} className={cn(styles.quote, className)} {...props}>
        {children}
      </blockquote>
    );
  },
);
TestimonialQuote.displayName = 'TestimonialQuote';

// ─── TestimonialRating ───────────────────────────────────────────────────────

export interface TestimonialRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rating value from 1 to 5 */
  value: number;
}

export const TestimonialRating = React.forwardRef<HTMLDivElement, TestimonialRatingProps>(
  ({ value, className, ...props }, ref) => {
    const clamped = Math.max(1, Math.min(5, Math.round(value)));
    return (
      <div
        ref={ref}
        className={cn(styles.rating, className)}
        role="img"
        aria-label={`${clamped} out of 5 stars`}
        {...props}
      >
        {['star-1', 'star-2', 'star-3', 'star-4', 'star-5'].map((id, i) => (
          <span
            key={id}
            className={cn(styles.star, i < clamped ? styles.starFilled : styles.starEmpty)}
            aria-hidden="true"
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  },
);
TestimonialRating.displayName = 'TestimonialRating';

// ─── TestimonialAuthor ───────────────────────────────────────────────────────

export interface TestimonialAuthorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Author name */
  name: string;
  /** Author job title */
  title?: string;
  /** Author company or organization */
  company?: string;
  /** Avatar image URL */
  avatar?: string;
}

export const TestimonialAuthor = React.forwardRef<HTMLElement, TestimonialAuthorProps>(
  ({ name, title, company, avatar, className, ...props }, ref) => {
    const attribution = [title, company].filter(Boolean).join(', ');
    return (
      <figcaption ref={ref} className={cn(styles.author, className)} {...props}>
        {avatar && <img src={avatar} alt="" className={styles.avatar} />}
        <div className={styles.authorInfo}>
          <cite className={styles.authorName}>{name}</cite>
          {attribution && <span className={styles.authorRole}>{attribution}</span>}
        </div>
      </figcaption>
    );
  },
);
TestimonialAuthor.displayName = 'TestimonialAuthor';
