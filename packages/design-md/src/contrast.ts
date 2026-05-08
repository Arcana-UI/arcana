import type { ContrastPair } from './types.js';

/**
 * Tiny WCAG 2.1 contrast calculator. Inlined here to keep the package
 * dependency-free; the playground has a fancier version in
 * `playground/src/utils/contrast.ts` but importing across workspace
 * boundaries for one function isn't worth the build-graph headache.
 */

function parseHex(input: string): [number, number, number] | null {
  const str = input.trim();
  if (!str.startsWith('#')) return null;
  if (str.length === 4) {
    const r = Number.parseInt(str[1] + str[1], 16);
    const g = Number.parseInt(str[2] + str[2], 16);
    const b = Number.parseInt(str[3] + str[3], 16);
    return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : [r, g, b];
  }
  if (str.length === 7) {
    const r = Number.parseInt(str.slice(1, 3), 16);
    const g = Number.parseInt(str.slice(3, 5), 16);
    const b = Number.parseInt(str.slice(5, 7), 16);
    return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : [r, g, b];
  }
  return null;
}

function parseRgba(input: string): [number, number, number] | null {
  // rgba on a known background is non-trivial; for our 5 contrast pairs we only
  // care about hex inputs. If we ever get an rgba here, treat it as unparseable
  // and let the caller skip the pair.
  const m = input.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return null;
  return [Number.parseInt(m[1]), Number.parseInt(m[2]), Number.parseInt(m[3])];
}

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb;
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

export function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = parseHex(fg) ?? parseRgba(fg);
  const bgRgb = parseHex(bg) ?? parseRgba(bg);
  if (!fgRgb || !bgRgb) return null;

  const fgLum = relativeLuminance(fgRgb);
  const bgLum = relativeLuminance(bgRgb);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

export function evaluatePair(name: string, fg: string, bg: string): ContrastPair | null {
  const ratio = contrastRatio(fg, bg);
  if (ratio === null) return null;
  return {
    pair: name,
    fg,
    bg,
    ratio: Math.round(ratio * 100) / 100,
    aaBody: ratio >= 4.5,
    aaLarge: ratio >= 3,
  };
}
