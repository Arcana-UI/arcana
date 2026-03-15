import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { ThemeId, ThemeSource, UseThemeReturn } from '../hooks/useTheme';

/** Props for the ThemeProvider component. */
export interface ThemeProviderProps {
  /** Child elements to render within the theme context. */
  children: ReactNode;
  /** Default theme to use when no stored preference exists and system detection is not used. */
  defaultTheme?: ThemeId;
  /** localStorage key for persisting theme preference. */
  storageKey?: string;
  /** When `true`, add smooth CSS transitions during theme changes. */
  enableTransitions?: boolean;
}

const ATTRIBUTE = 'data-theme';
const TRANSITION_ATTRIBUTE = 'data-theme-transition';

const THEME_IDS: readonly ThemeId[] = [
  'light',
  'dark',
  'terminal',
  'retro98',
  'glass',
  'brutalist',
] as const;

const ThemeContext = createContext<UseThemeReturn | null>(null);

/**
 * Reads the persisted theme from localStorage.
 */
function getStoredTheme(key: string): ThemeId | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    if (stored && THEME_IDS.includes(stored as ThemeId)) {
      return stored as ThemeId;
    }
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/**
 * Persists the theme choice to localStorage.
 */
function storeTheme(key: string, theme: ThemeId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (theme === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, theme);
    }
  } catch {
    // Silently fail
  }
}

/**
 * Provides theme state to the component tree via React context.
 *
 * Handles system preference detection (`prefers-color-scheme`), manual override,
 * localStorage persistence, and optional CSS transitions during theme changes.
 *
 * @example
 * ```tsx
 * import { ThemeProvider, useThemeContext } from '@arcana-ui/core';
 *
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="light" enableTransitions>
 *       <ThemeSwitcher />
 *     </ThemeProvider>
 *   );
 * }
 *
 * function ThemeSwitcher() {
 *   const { theme, setTheme, themes } = useThemeContext();
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeId)}>
 *       {themes.map((t) => <option key={t} value={t}>{t}</option>)}
 *     </select>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'arcana-theme',
  enableTransitions = false,
}: ThemeProviderProps): ReactNode {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [manualTheme, setManualTheme] = useState<ThemeId | null>(() => getStoredTheme(storageKey));

  // Resolve: manual > system > defaultTheme
  const resolvedTheme: ThemeId = manualTheme ?? (systemPrefersDark ? 'dark' : defaultTheme);
  const source: ThemeSource = manualTheme !== null ? 'manual' : 'system';

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    const shouldTransition = enableTransitions && !prefersReducedMotion;

    if (shouldTransition) {
      root.setAttribute(TRANSITION_ATTRIBUTE, '');
    }

    root.setAttribute(ATTRIBUTE, resolvedTheme);

    if (shouldTransition) {
      // Remove transition attribute after transition completes
      const timer = setTimeout(() => {
        root.removeAttribute(TRANSITION_ATTRIBUTE);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, enableTransitions, prefersReducedMotion]);

  const setTheme = useCallback(
    (theme: ThemeId) => {
      setManualTheme(theme);
      storeTheme(storageKey, theme);
    },
    [storageKey],
  );

  const followSystem = useCallback(() => {
    setManualTheme(null);
    storeTheme(storageKey, null);
  }, [storageKey]);

  const value = useMemo<UseThemeReturn>(
    () => ({
      theme: resolvedTheme,
      source,
      themes: THEME_IDS,
      systemPrefersDark,
      setTheme,
      followSystem,
    }),
    [resolvedTheme, source, systemPrefersDark, setTheme, followSystem],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the theme context provided by `ThemeProvider`.
 *
 * @throws Error if called outside of a `ThemeProvider`.
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useThemeContext();
 * ```
 */
export function useThemeContext(): UseThemeReturn {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useThemeContext must be used within a <ThemeProvider>.');
  }
  return ctx;
}
