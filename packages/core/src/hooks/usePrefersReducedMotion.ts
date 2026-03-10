import { useMediaQuery } from './useMediaQuery';

/**
 * Returns `true` when the user has enabled "Prefer reduced motion"
 * in their OS or browser settings.
 *
 * SSR-safe: returns `false` when `window` is unavailable.
 *
 * Note: CSS-level reduced motion is already handled by the Arcana token system
 * (all `--duration-*` tokens are zeroed out via a `prefers-reduced-motion` media
 * query in arcana.css). This hook is for **JavaScript-driven** animations where
 * CSS transitions don't apply (e.g., number counters, auto-playing carousels).
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 * // Skip JS-driven animation when true
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
