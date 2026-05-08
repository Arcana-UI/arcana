/**
 * Regenerate the 14 preset DESIGN.md files in `packages/claude-design-pack/presets/`
 * plus the manifest at `packages/claude-design-pack/manifest.claude-design.json`.
 *
 * Run with `pnpm --filter @arcana-ui/claude-design-pack regenerate`.
 *
 * --check: don't write; instead, regenerate in-memory, diff against the
 *          on-disk files, and exit non-zero if they differ. This is the CI
 *          guard that keeps presets/ from drifting away from the source.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type ArcanaPreset, type MotionPersonality, presetToDesignMd } from '@arcana-ui/design-md';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_PRESETS = path.resolve(ROOT, '..', 'tokens', 'src', 'presets');
const PRESETS_OUT = path.resolve(ROOT, 'presets');
const MANIFEST_OUT = path.resolve(ROOT, 'manifest.claude-design.json');
const REPO_RAW = 'https://raw.githubusercontent.com/Arcana-UI/arcana/main';

interface ManifestEntry {
  slug: string;
  name: string;
  description: string;
  motionPersonality: MotionPersonality | 'default';
  swatches: { background: string; surface: string; accent: string };
  designMdUrl: string;
  codebaseUrl: string;
}

interface Manifest {
  version: 'alpha';
  generated: string;
  source: string;
  presets: ManifestEntry[];
}

function presetSlug(presetName: string): string {
  return presetName.replace(/^arcana-/, '');
}

function humanize(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function inferMotionPersonality(preset: ArcanaPreset): MotionPersonality | 'default' {
  // Mirrors the lookup in @arcana-ui/design-md/src/prose.ts so the manifest
  // shows the same personality the DESIGN.md does.
  const map: Record<string, MotionPersonality> = {
    'arcana-light': 'default',
    'arcana-dark': 'default',
    'arcana-midnight': 'calm',
    'arcana-terminal': 'snappy',
    'arcana-retro98': 'step',
    'arcana-glass': 'languid',
    'arcana-brutalist': 'static',
    'arcana-corporate': 'default',
    'arcana-startup': 'snappy',
    'arcana-editorial': 'calm',
    'arcana-commerce': 'default',
    'arcana-nature': 'organic',
    'arcana-neon': 'spring',
    'arcana-mono': 'default',
  };
  return map[preset.name] ?? 'default';
}

function pickSwatch(preset: ArcanaPreset, paths: string[], fallback: string): string {
  for (const p of paths) {
    const parts = p.split('.');
    let cur: unknown = preset;
    for (const part of parts) {
      if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[part];
      } else {
        cur = undefined;
        break;
      }
    }
    if (typeof cur === 'string' && cur.startsWith('#')) return cur;
    if (typeof cur === 'string' && cur.startsWith('{')) {
      // Resolve once.
      const ref = cur.slice(1, -1);
      const refParts = ref.split('.');
      let r: unknown = preset;
      for (const part of refParts) {
        if (r && typeof r === 'object' && part in (r as Record<string, unknown>)) {
          r = (r as Record<string, unknown>)[part];
        } else {
          r = undefined;
          break;
        }
      }
      if (typeof r === 'string' && r.startsWith('#')) return r;
    }
  }
  return fallback;
}

function loadPresets(): ArcanaPreset[] {
  return readdirSync(TOKENS_PRESETS)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(readFileSync(path.join(TOKENS_PRESETS, f), 'utf8')) as ArcanaPreset);
}

function buildPack(presets: ArcanaPreset[]): { md: Map<string, string>; manifest: Manifest } {
  const md = new Map<string, string>();
  const entries: ManifestEntry[] = [];

  for (const preset of presets) {
    const slug = presetSlug(preset.name);
    md.set(slug, presetToDesignMd(preset));
    entries.push({
      slug,
      name: humanize(slug),
      description: (preset.description ?? '').replace(/—/g, ' - ').replace(/ {2,}/g, ' ').trim(),
      motionPersonality: inferMotionPersonality(preset),
      swatches: {
        background: pickSwatch(preset, ['semantic.color.background.page'], '#ffffff'),
        surface: pickSwatch(preset, ['semantic.color.background.surface'], '#f5f5f5'),
        accent: pickSwatch(
          preset,
          ['semantic.color.action.primary.default', 'semantic.color.accent.default'],
          '#3b82f6',
        ),
      },
      designMdUrl: `${REPO_RAW}/packages/claude-design-pack/presets/${slug}.md`,
      codebaseUrl: 'https://github.com/Arcana-UI/arcana',
    });
  }

  const manifest: Manifest = {
    version: 'alpha',
    generated: new Date().toISOString().slice(0, 10),
    source: 'https://github.com/Arcana-UI/arcana/tree/main/packages/tokens/src/presets',
    presets: entries,
  };

  return { md, manifest };
}

function readExisting(): { md: Map<string, string>; manifest: string | null } {
  const md = new Map<string, string>();
  if (existsSync(PRESETS_OUT)) {
    for (const f of readdirSync(PRESETS_OUT)) {
      if (f.endsWith('.md')) {
        md.set(f.replace('.md', ''), readFileSync(path.join(PRESETS_OUT, f), 'utf8'));
      }
    }
  }
  const manifest = existsSync(MANIFEST_OUT) ? readFileSync(MANIFEST_OUT, 'utf8') : null;
  return { md, manifest };
}

function write(md: Map<string, string>, manifest: Manifest): void {
  rmSync(PRESETS_OUT, { recursive: true, force: true });
  mkdirSync(PRESETS_OUT, { recursive: true });
  for (const [slug, content] of md) {
    writeFileSync(path.join(PRESETS_OUT, `${slug}.md`), content);
  }
  writeFileSync(MANIFEST_OUT, `${JSON.stringify(manifest, null, 2)}\n`);
}

function main(): void {
  const checkMode = process.argv.includes('--check');
  const presets = loadPresets();
  const { md, manifest } = buildPack(presets);
  // For --check, normalize the `generated` date so daily clock drift doesn't
  // trip the CI guard. The drift we care about is the DESIGN.md content.
  const manifestForCompare: Manifest = checkMode
    ? { ...manifest, generated: 'CHECK_MODE' }
    : manifest;
  const manifestText = `${JSON.stringify(manifestForCompare, null, 2)}\n`;

  if (!checkMode) {
    write(md, manifest);
    console.log(`Regenerated ${md.size} DESIGN.md files plus manifest.`);
    return;
  }

  const existing = readExisting();
  const drift: string[] = [];
  for (const [slug, content] of md) {
    if (existing.md.get(slug) !== content) drift.push(`${slug}.md`);
  }
  for (const slug of existing.md.keys()) {
    if (!md.has(slug)) drift.push(`${slug}.md (extra file on disk)`);
  }

  // Compare manifests with the same date-normalization applied to existing.
  const existingNormalized = existing.manifest
    ? existing.manifest.replace(/"generated": "[^"]+"/, '"generated": "CHECK_MODE"')
    : null;
  if (existingNormalized !== manifestText) drift.push('manifest.claude-design.json');

  if (drift.length > 0) {
    console.error(
      'claude-design-pack drift detected. Run pnpm --filter @arcana-ui/claude-design-pack regenerate.',
    );
    for (const d of drift) console.error(`  - ${d}`);
    process.exit(1);
  }
  console.log('claude-design-pack is in sync with source presets.');
}

main();
