import { useMediaQuery } from './useMediaQuery';

/** Named breakpoint identifier */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Return value of the useBreakpoint hook */
export interface UseBreakpointReturn {
  /** Current active breakpoint name */
  breakpoint: Breakpoint;
  /** True when viewport is below 640px */
  isMobile: boolean;
  /** True when viewport is 640px–1023px */
  isTablet: boolean;
  /** True when viewport is 1024px or wider */
  isDesktop: boolean;
}

/**
 * Returns the current active breakpoint and convenience booleans.
 * SSR-safe: defaults to `"lg"` (desktop) when `window` is unavailable.
 *
 * Breakpoint values match the layout token system:
 * - sm: < 640px
 * - md: 640px – 1023px
 * - lg: 1024px – 1279px
 * - xl: 1280px – 1535px
 * - 2xl: >= 1536px
 *
 * @example
 * ```tsx
 * const { breakpoint, isMobile, isDesktop } = useBreakpoint();
 * ```
 */
export function useBreakpoint(): UseBreakpointReturn {
  /* breakpoint-sm: 640px */
  const isSm = useMediaQuery('(min-width: 640px)');
  /* breakpoint-lg: 1024px */
  const isLg = useMediaQuery('(min-width: 1024px)');
  /* breakpoint-xl: 1280px */
  const isXl = useMediaQuery('(min-width: 1280px)');
  /* breakpoint-2xl: 1536px */
  const is2xl = useMediaQuery('(min-width: 1536px)');

  let breakpoint: Breakpoint;
  if (is2xl) {
    breakpoint = '2xl';
  } else if (isXl) {
    breakpoint = 'xl';
  } else if (isLg) {
    breakpoint = 'lg';
  } else if (isSm) {
    breakpoint = 'md';
  } else {
    breakpoint = 'sm';
  }

  return {
    breakpoint,
    isMobile: !isSm,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
  };
}
