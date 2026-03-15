import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useThemeContext } from '../context/ThemeProvider';
import { useTheme } from './useTheme';

// Mock matchMedia
function createMatchMedia(prefersDark: boolean): (query: string) => MediaQueryList {
  return (query: string) => {
    const matches = query === '(prefers-color-scheme: dark)' ? prefersDark : false;
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        listeners.push(cb);
      },
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        const idx = listeners.indexOf(cb);
        if (idx >= 0) listeners.splice(idx, 1);
      },
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  };
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light theme when no system preference or stored value', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.source).toBe('system');
    expect(result.current.systemPrefersDark).toBe(false);
  });

  it('defaults to dark when system prefers dark', () => {
    window.matchMedia = createMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.source).toBe('system');
    expect(result.current.systemPrefersDark).toBe(true);
  });

  it('applies theme to document.documentElement', () => {
    renderHook(() => useTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('setTheme overrides system preference', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('terminal');
    });

    expect(result.current.theme).toBe('terminal');
    expect(result.current.source).toBe('manual');
    expect(document.documentElement.getAttribute('data-theme')).toBe('terminal');
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('brutalist');
    });

    expect(localStorage.getItem('arcana-theme')).toBe('brutalist');
  });

  it('reads stored theme on mount', () => {
    localStorage.setItem('arcana-theme', 'glass');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('glass');
    expect(result.current.source).toBe('manual');
  });

  it('followSystem clears manual override', () => {
    localStorage.setItem('arcana-theme', 'retro98');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('retro98');

    act(() => {
      result.current.followSystem();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.source).toBe('system');
    expect(localStorage.getItem('arcana-theme')).toBeNull();
  });

  it('exposes all available themes', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.themes).toEqual([
      'light',
      'dark',
      'terminal',
      'retro98',
      'glass',
      'brutalist',
    ]);
  });

  it('ignores invalid stored theme values', () => {
    localStorage.setItem('arcana-theme', 'nonexistent');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.source).toBe('system');
  });
});

describe('ThemeProvider + useThemeContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-transition');
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-transition');
  });

  it('provides theme context to children', () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.theme).toBe('light');
  });

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useThemeContext());
    }).toThrow('useThemeContext must be used within a <ThemeProvider>.');
  });

  it('allows setTheme through context', () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('supports custom defaultTheme', () => {
    const customWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useThemeContext(), { wrapper: customWrapper });
    expect(result.current.theme).toBe('dark');
  });

  it('supports custom storageKey', () => {
    const customWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider storageKey="my-theme">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useThemeContext(), { wrapper: customWrapper });

    act(() => {
      result.current.setTheme('glass');
    });

    expect(localStorage.getItem('my-theme')).toBe('glass');
    expect(localStorage.getItem('arcana-theme')).toBeNull();
  });

  it('sets transition attribute when enableTransitions is true', () => {
    const transitionWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider enableTransitions>{children}</ThemeProvider>
    );

    renderHook(() => useThemeContext(), { wrapper: transitionWrapper });
    expect(document.documentElement.hasAttribute('data-theme-transition')).toBe(true);
  });

  it('followSystem respects defaultTheme when system does not prefer dark', () => {
    const customWrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
    );

    localStorage.setItem('arcana-theme', 'terminal');
    const { result } = renderHook(() => useThemeContext(), { wrapper: customWrapper });
    expect(result.current.theme).toBe('terminal');

    act(() => {
      result.current.followSystem();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.source).toBe('system');
  });
});
