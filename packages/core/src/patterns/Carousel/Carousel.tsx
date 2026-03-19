import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Carousel.module.css';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slide content */
  children: React.ReactNode;
  /** Auto-advance slides */
  autoPlay?: boolean;
  /** Auto-play interval in ms */
  autoPlayInterval?: number;
  /** Wrap around when reaching the end */
  loop?: boolean;
  /** Show prev/next arrow buttons */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Gap between slides */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  /** Accessible label */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      autoPlay = false,
      autoPlayInterval = 5000,
      loop = true,
      showArrows = true,
      showDots = true,
      gap = 'md',
      label = 'Carousel',
      className,
      ...props
    },
    ref,
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const slides = React.Children.toArray(children);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    // Sync scroll position with current slide index
    const scrollToSlide = useCallback((index: number) => {
      const container = scrollRef.current;
      if (!container) return;
      const slide = container.children[index] as HTMLElement | undefined;
      slide?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }, []);

    const goTo = useCallback(
      (index: number) => {
        let next = index;
        if (next < 0) next = loop ? slides.length - 1 : 0;
        if (next >= slides.length) next = loop ? 0 : slides.length - 1;
        setCurrent(next);
        scrollToSlide(next);
      },
      [loop, slides.length, scrollToSlide],
    );

    const prev = useCallback(() => goTo(current - 1), [current, goTo]);
    const next = useCallback(() => goTo(current + 1), [current, goTo]);

    // Track scroll position to sync dots
    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;
      const handler = () => {
        const slideWidth = container.scrollWidth / slides.length;
        const idx = Math.round(container.scrollLeft / slideWidth);
        setCurrent(Math.min(idx, slides.length - 1));
      };
      container.addEventListener('scroll', handler, { passive: true });
      return () => container.removeEventListener('scroll', handler);
    }, [slides.length]);

    // Auto-play
    useEffect(() => {
      if (!autoPlay || paused) return;
      const timer = setInterval(() => goTo(current + 1), autoPlayInterval);
      return () => clearInterval(timer);
    }, [autoPlay, paused, autoPlayInterval, current, goTo]);

    // Pause on reduced motion
    useEffect(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) setPaused(true);
    }, []);

    return (
      <div
        ref={ref}
        role="region"
        aria-label={label}
        aria-roledescription="carousel"
        className={cn(styles.carousel, className)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        {...props}
      >
        <div ref={scrollRef} className={cn(styles.track, styles[`gap-${gap}`])}>
          {slides.map((slide, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: slides reordering is not expected
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${slides.length}`}
              className={styles.slide}
            >
              {slide}
            </div>
          ))}
        </div>

        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              className={cn(styles.arrow, styles.arrowPrev)}
              onClick={prev}
              aria-label="Previous slide"
              disabled={!loop && current === 0}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={cn(styles.arrow, styles.arrowNext)}
              onClick={next}
              aria-label="Next slide"
              disabled={!loop && current === slides.length - 1}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {showDots && slides.length > 1 && (
          <div className={styles.dots} role="tablist" aria-label="Slide navigation">
            {slides.map((_, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: dot indicators
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(styles.dot, i === current && styles.dotActive)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
Carousel.displayName = 'Carousel';
