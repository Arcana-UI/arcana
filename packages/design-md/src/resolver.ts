import type { ArcanaPreset } from './types.js';

const REF_PATTERN = /^\{([^}]+)\}$/;

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

/**
 * Resolve a token value through reference chains. The Arcana preset JSON uses
 * `{path.to.token}` strings to point semantic tokens at primitive values; this
 * function follows those chains until it lands on a literal (or gives up after
 * 16 hops to avoid cycles).
 */
export function resolveToken(value: unknown, preset: ArcanaPreset, depth = 0): string | undefined {
  if (depth > 16) return undefined;
  if (typeof value !== 'string') return value === undefined ? undefined : String(value);

  const match = value.match(REF_PATTERN);
  if (!match) return value;

  const referenced = getByPath(preset, match[1]);
  if (referenced === undefined) return value;

  return resolveToken(referenced, preset, depth + 1);
}

/** Convenience: resolve and require a string result, falling back to a default. */
export function resolveString(value: unknown, preset: ArcanaPreset, fallback = ''): string {
  const out = resolveToken(value, preset);
  return typeof out === 'string' ? out : fallback;
}

/** Pull a value at a dotted path, then resolve any reference chain it contains. */
export function pickResolved(preset: ArcanaPreset, path: string, fallback = ''): string {
  const raw = getByPath(preset, path);
  return resolveString(raw, preset, fallback);
}
