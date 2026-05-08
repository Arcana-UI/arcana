/**
 * `arcana-ui export-design-md` - emit a Google DESIGN.md spec file for an
 * Arcana preset. Designed for the Claude Design "Add assets" flow:
 *
 *   arcana-ui export-design-md midnight             # writes ./midnight.md
 *   arcana-ui export-design-md all                  # writes 14 .md files to ./
 *   arcana-ui export-design-md neon --out ./neon.md
 *   arcana-ui export-design-md all --validate       # also runs @google/design.md lint
 *
 * --validate is opt-in because it runs `npx @google/design.md lint` over the
 * network. Default behavior stays offline-friendly.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type ArcanaPreset, presetToDesignMd } from '@arcana-ui/design-md';
import * as log from '../utils/logger.js';
import { PRESET_IDS, isValidPreset } from '../utils/presets.js';

export interface ExportDesignMdOptions {
  out?: string;
  validate?: boolean;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRESETS_DIR = path.resolve(__dirname, 'presets');

function loadPreset(presetId: string): ArcanaPreset {
  const file = path.join(PRESETS_DIR, `${presetId}.json`);
  return JSON.parse(readFileSync(file, 'utf8')) as ArcanaPreset;
}

function exportOne(presetId: string, outPath: string): void {
  const preset = loadPreset(presetId);
  const md = presetToDesignMd(preset);
  writeFileSync(outPath, md, 'utf8');
}

function validateOne(filePath: string): { ok: boolean; message: string } {
  try {
    const output = execSync(`npx --yes @google/design.md@latest lint "${filePath}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const result = JSON.parse(output);
    const errors = result.summary?.errors ?? 0;
    const warnings = result.summary?.warnings ?? 0;
    if (errors > 0) return { ok: false, message: `${errors} error(s), ${warnings} warning(s)` };
    return { ok: true, message: warnings > 0 ? `${warnings} warning(s)` : 'clean' };
  } catch (err) {
    return { ok: false, message: (err as Error).message.split('\n')[0] };
  }
}

export async function runExportDesignMd(
  presetArg: string | undefined,
  opts: ExportDesignMdOptions,
): Promise<void> {
  log.logo();

  if (!presetArg) {
    log.error('Specify a preset id or "all". Run `arcana-ui add-theme --list` to see options.');
    process.exit(1);
  }

  const isAll = presetArg === 'all';
  if (!isAll && !isValidPreset(presetArg)) {
    log.error(`Unknown preset "${presetArg}". Run \`arcana-ui add-theme --list\` to see options.`);
    process.exit(1);
  }

  const targets = isAll ? PRESET_IDS : [presetArg];
  const start = Date.now();
  const validationResults: Array<{ id: string; ok: boolean; message: string }> = [];

  for (const id of targets) {
    const outPath = isAll
      ? path.resolve(process.cwd(), `${id}.md`)
      : path.resolve(process.cwd(), opts.out ?? `${id}.md`);

    exportOne(id, outPath);
    log.info(`Wrote ${path.relative(process.cwd(), outPath)}`);

    if (opts.validate) {
      const result = validateOne(outPath);
      validationResults.push({ id, ...result });
      if (!result.ok) {
        log.warn(`  ${id}: ${result.message}`);
      } else {
        log.info(`  ${id}: ${result.message}`);
      }
    }
  }

  const elapsed = Date.now() - start;
  log.success(
    `${targets.length} ${targets.length === 1 ? 'theme' : 'themes'} exported in ${elapsed}ms.`,
  );

  if (opts.validate) {
    const failed = validationResults.filter((r) => !r.ok);
    if (failed.length > 0) {
      log.error(`${failed.length} preset(s) failed @google/design.md spec validation.`);
      process.exit(1);
    }
    log.success('All exported files validate against @google/design.md spec.');
  }
}
