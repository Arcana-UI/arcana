import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './StatsBar.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface StatItemData {
  /** The stat value (numeric or string) */
  value: string | number;
  /** Label describing the stat */
  label: string;
  /** Prefix displayed before the value (e.g., "$") */
  prefix?: string;
  /** Suffix displayed after the value (e.g., "%", "+") */
  suffix?: string;
  /** Trend direction indicator */
  trend?: 'up' | 'down' | 'neutral';
}

export interface StatsBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of stat items to display */
  stats: StatItemData[];
  /** Layout variant */
  variant?: 'inline' | 'card';
}

// ─── Animated Number Hook ───────────────────────────────────────────────────

function useAnimatedNumber(target: number, shouldAnimate: boolean, reducedMotion: boolean): number {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!shouldAnimate || reducedMotion) {
      setCurrent(target);
      return;
    }

    setCurrent(0);
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number): void => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, shouldAnimate, reducedMotion]);

  return current;
}

// ─── StatValue (animated) ───────────────────────────────────────────────────

function StatValue({
  item,
  isVisible,
  reducedMotion,
}: {
  item: StatItemData;
  isVisible: boolean;
  reducedMotion: boolean;
}): React.ReactElement {
  const rawValue = String(item.value);
  const numericValue = typeof item.value === 'number' ? item.value : Number(rawValue);
  const isNumeric =
    typeof item.value === 'number' ||
    (rawValue.trim() !== '' &&
      !Number.isNaN(numericValue) &&
      String(numericValue) === rawValue.trim());
  const animatedValue = useAnimatedNumber(
    isNumeric ? numericValue : 0,
    isVisible && isNumeric,
    reducedMotion,
  );

  const displayValue = isNumeric ? String(animatedValue) : String(item.value);

  return (
    <dd className={styles.value}>
      {item.prefix && <span className={styles.prefix}>{item.prefix}</span>}
      <span>{displayValue}</span>
      {item.suffix && <span className={styles.suffix}>{item.suffix}</span>}
      {item.trend && item.trend !== 'neutral' && (
        <span
          className={cn(
            styles.trend,
            item.trend === 'up' && styles.trendUp,
            item.trend === 'down' && styles.trendDown,
          )}
          aria-label={`trending ${item.trend}`}
        >
          {item.trend === 'up' ? '\u2191' : '\u2193'}
        </span>
      )}
    </dd>
  );
}

// ─── StatsBar ───────────────────────────────────────────────────────────────

export const StatsBar = React.forwardRef<HTMLElement, StatsBarProps>(
  ({ stats, variant = 'inline', className, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent): void => setReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }, []);

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      }
    }, []);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });
      observer.observe(el);
      return () => observer.disconnect();
    }, [handleIntersection]);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref],
    );

    return (
      <section ref={setRefs} className={cn(styles.statsBar, styles[variant], className)} {...props}>
        <dl className={styles.list}>
          {stats.map((item) => (
            <div
              key={item.label}
              className={cn(styles.item, variant === 'card' && styles.itemCard)}
            >
              <StatValue item={item} isVisible={isVisible} reducedMotion={reducedMotion} />
              <dt className={styles.label}>{item.label}</dt>
            </div>
          ))}
        </dl>
        {children}
      </section>
    );
  },
);
StatsBar.displayName = 'StatsBar';
