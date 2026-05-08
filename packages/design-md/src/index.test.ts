import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { presetToDesignMd } from './index.js';
import type { ArcanaPreset } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presetsDir = path.resolve(__dirname, '..', '..', 'tokens', 'src', 'presets');

function loadPreset(name: string): ArcanaPreset {
  const file = path.join(presetsDir, `${name}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as ArcanaPreset;
}

// Three presets covering different motion personalities, density rhythms, and
// shape languages. The snapshot file IS the public contract: changes here
// break consumer DESIGN.md files, so they should be deliberate.
describe('presetToDesignMd', () => {
  it('converts the light preset (default motion)', () => {
    const preset = loadPreset('light');
    expect(presetToDesignMd(preset)).toMatchSnapshot();
  });

  it('converts the midnight preset (calm motion, dense)', () => {
    const preset = loadPreset('midnight');
    expect(presetToDesignMd(preset)).toMatchSnapshot();
  });

  it('converts the brutalist preset (zero motion, hard shapes)', () => {
    const preset = loadPreset('brutalist');
    expect(presetToDesignMd(preset)).toMatchSnapshot();
  });

  it('emits the spec section order across presets', () => {
    const md = presetToDesignMd(loadPreset('light'));
    const sectionOrder = md
      .split('\n')
      .filter((line) => line.startsWith('## '))
      .map((line) => line.slice(3).trim());

    expect(sectionOrder).toEqual([
      'Overview',
      'Colors',
      'Typography',
      'Layout',
      'Elevation & Depth',
      'Shapes',
      'Motion',
      'Components',
      "Do's and Don'ts",
    ]);
  });

  it('strips em dashes from descriptions', () => {
    const preset = loadPreset('midnight');
    const md = presetToDesignMd(preset);
    expect(md).not.toContain('—');
  });

  it('respects the description override option', () => {
    const preset = loadPreset('light');
    const md = presetToDesignMd(preset, { description: 'Custom description.' });
    expect(md).toContain('description: Custom description.');
  });

  it('emits valid YAML front matter delimiters', () => {
    const md = presetToDesignMd(loadPreset('light'));
    expect(md.startsWith('---\n')).toBe(true);
    const closingIdx = md.indexOf('\n---\n', 4);
    expect(closingIdx).toBeGreaterThan(0);
  });

  it('emits at least 5 WCAG contrast pairs in the Colors section', () => {
    const md = presetToDesignMd(loadPreset('midnight'));
    const tableLines = md.split('\n').filter((l) => l.startsWith('|') && l.includes('#'));
    expect(tableLines.length).toBeGreaterThanOrEqual(5);
  });
});
