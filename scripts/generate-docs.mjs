#!/usr/bin/env node
/**
 * generate-docs.mjs
 *
 * Unified single-source-of-truth documentation pipeline for Arcana UI.
 * Runs all generators in order to produce machine-readable and human-readable
 * docs derived entirely from source code.
 *
 * Run:   node scripts/generate-docs.mjs
 * Check: node scripts/generate-docs.mjs --check
 *
 * Generators:
 *   1. Component Registry (manifest.ai.json) — via generate-manifest.mjs
 *   2. Component-to-Token Mapping (docs/generated/token-component-map.json)
 *   3. Component Inventory (docs/generated/COMPONENT-INVENTORY.md)
 *   4. Component Tokens Reference (docs/generated/COMPONENT-TOKENS.md)
 *   5. Export Verification (console warnings)
 *   6. AI Agent Files (llms.txt, llms-full.txt)
 *   7. Version Sync (manifest.ai.json version ↔ package.json)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CORE_SRC = path.resolve(ROOT, 'packages/core/src');
const CORE_PKG_PATH = path.resolve(ROOT, 'packages/core/package.json');
const INDEX_PATH = path.resolve(CORE_SRC, 'index.ts');
const MANIFEST_PATH = path.resolve(ROOT, 'manifest.ai.json');
const GENERATED_DIR = path.resolve(ROOT, 'docs/generated');
const TOKEN_MAP_PATH = path.resolve(GENERATED_DIR, 'token-component-map.json');
const PLAYGROUND_TOKEN_MAP_PATH = path.resolve(ROOT, 'playground/src/data/token-map.json');
const INVENTORY_PATH = path.resolve(GENERATED_DIR, 'COMPONENT-INVENTORY.md');
const TOKENS_DOC_PATH = path.resolve(GENERATED_DIR, 'COMPONENT-TOKENS.md');
const LLMS_PATH = path.resolve(ROOT, 'llms.txt');
const LLMS_FULL_PATH = path.resolve(ROOT, 'llms-full.txt');
const CHANGELOG_PATH = path.resolve(ROOT, 'CHANGELOG.md');

const NOW = new Date().toISOString();
const CHECK_MODE = process.argv.includes('--check');

// Ensure output directory exists
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// ── Shared Utilities ────────────────────────────────────────────────────────

/** Execute a regex globally and return all matches */
function matchAll(regex, str) {
  const results = [];
  let m = regex.exec(str);
  while (m !== null) {
    results.push(m);
    m = regex.exec(str);
  }
  return results;
}

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
}

/** Find all *.module.css files under a directory recursively */
function findCSSFiles(dir) {
  const results = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.module.css')) {
        const componentName = entry.name.replace('.module.css', '').toLowerCase();
        results.push({ componentName, filePath: fullPath });
      }
    }
  }
  walk(dir);
  return results;
}

/** Classify a token into a category */
function classifyToken(token) {
  if (token.startsWith('--color-') || token.startsWith('--primitive-')) return 'color';
  if (
    token.startsWith('--font-') ||
    token.startsWith('--line-height') ||
    token.startsWith('--letter-spacing')
  )
    return 'typography';
  if (token.startsWith('--spacing-')) return 'spacing';
  if (
    token.startsWith('--shadow-') ||
    token.startsWith('--elevation-') ||
    token.startsWith('--z-') ||
    token.startsWith('--backdrop-blur')
  )
    return 'elevation';
  if (token.startsWith('--radius-') || token.startsWith('--border-')) return 'shape';
  if (
    token.startsWith('--duration-') ||
    token.startsWith('--ease-') ||
    token.startsWith('--transition-')
  )
    return 'motion';
  if (token.startsWith('--opacity-')) return 'opacity';
  if (token.startsWith('--focus-')) return 'shape';
  if (token.startsWith('--container-') || token.startsWith('--grid-')) return 'layout';
  return 'other';
}

/** Check if a token is a component-level token (tier 3) */
function isComponentToken(token) {
  const category = classifyToken(token);
  if (category === 'other') {
    return /^--(button|input|textarea|select|checkbox|radio|toggle|badge|avatar|card|modal|alert|toast|banner|tabs|accordion|skeleton|spinner|navbar|sidebar|breadcrumb|pagination|footer|hero|feature-section|testimonial|pricing-card|cta|stats-bar|timeline|logo-cloud|data-table|stat-card|kpi-card|progress-bar|drawer|popover|command-palette|bottom-sheet|mobile-nav|drawer-nav|table|divider|spacer|product-card|cart-item|quantity-selector|price-display|rating-stars|article-layout|pull-quote|author-card|related-posts|newsletter-signup|scroll-area|collapsible|copy-button|keyboard-shortcut|date-picker|file-upload|form|empty-state|error-boundary|carousel|image)-/.test(
      token,
    );
  }
  return false;
}

/** Parse index.ts to get all exports with their source paths */
function parseIndex() {
  const indexSource = fs.readFileSync(INDEX_PATH, 'utf-8');
  const exports = [];
  const reExportRegex = /export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let match = reExportRegex.exec(indexSource);
  while (match !== null) {
    const names = match[1]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
    const fromPath = match[2];
    for (const name of names) {
      exports.push({ name, fromPath });
    }
    match = reExportRegex.exec(indexSource);
  }
  const seen = new Set();
  return exports.filter((e) => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });
}

/** Get all component directories (physical directories with .tsx files) */
function getComponentDirs() {
  const dirs = new Set();
  const categories = ['primitives', 'composites', 'patterns', 'layout'];
  for (const cat of categories) {
    const catPath = path.join(CORE_SRC, cat);
    if (!fs.existsSync(catPath)) continue;
    if (cat === 'layout') {
      // layout is a flat directory, not subdirs
      dirs.add({ name: 'Layout', dir: catPath, category: cat });
      continue;
    }
    const entries = fs.readdirSync(catPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        dirs.add({ name: entry.name, dir: path.join(catPath, entry.name), category: cat });
      }
    }
  }
  return Array.from(dirs);
}

// ── GENERATOR 1: Manifest (delegates to existing script) ────────────────────

async function runManifestGenerator() {
  console.log('  [1/7] Component Registry (manifest.ai.json)...');
  // Import and run the existing manifest generator inline
  const { execSync } = await import('node:child_process');
  execSync('node scripts/generate-manifest.mjs', { cwd: ROOT, stdio: 'pipe' });

  const manifest = readJSON(MANIFEST_PATH);
  console.log(
    `         ${manifest.components?.length || 0} components, ${manifest.hooks?.length || 0} hooks`,
  );
  return manifest;
}

// ── GENERATOR 2: Component-to-Token Mapping ─────────────────────────────────

function runTokenMapGenerator() {
  console.log('  [2/7] Component-to-Token Mapping...');

  const cssFiles = findCSSFiles(CORE_SRC);
  const componentToTokens = {};
  const tokenToComponents = {};

  for (const { componentName, filePath } of cssFiles) {
    const cssContent = fs.readFileSync(filePath, 'utf-8');

    // Extract all var() references
    const allTokens = new Set();
    for (const m of matchAll(/var\(\s*(--[\w-]+)/g, cssContent)) {
      allTokens.add(m[1]);
    }

    // Extract fallback mappings: var(--comp-token, var(--semantic-token))
    const fallbacks = {};
    for (const m of matchAll(/var\(\s*(--[\w-]+)\s*,\s*var\(\s*(--[\w-]+)\s*\)/g, cssContent)) {
      fallbacks[m[1]] = m[2];
    }

    // Extract property context: find which CSS property uses each var()
    // Handles multiline declarations like:
    //   border: var(--x, var(--y)) solid
    //     var(--z, transparent);
    const propertyMap = {};
    const stripped = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const decl of matchAll(/([\w-]+)\s*:\s*((?:[^;{}]|\n)*?);/g, stripped)) {
      const prop = decl[1];
      const value = decl[2];
      for (const tm of matchAll(/var\(\s*(--[\w-]+)/g, value)) {
        const token = tm[1];
        if (!propertyMap[token]) propertyMap[token] = [];
        if (!propertyMap[token].includes(prop)) propertyMap[token].push(prop);
      }
    }

    const compTokens = Array.from(allTokens)
      .filter((t) => isComponentToken(t))
      .sort();
    const semTokens = Array.from(allTokens)
      .filter((t) => !isComponentToken(t))
      .sort();

    // Build component → tokens entry
    componentToTokens[componentName] = {
      componentTokens: compTokens.map((name) => ({
        name,
        fallback: fallbacks[name] || null,
        property: (propertyMap[name] || [])[0] || null,
      })),
      semanticTokens: semTokens.map((name) => ({
        name,
        property: (propertyMap[name] || [])[0] || null,
      })),
    };

    // Build token → components entries
    for (const token of allTokens) {
      if (!tokenToComponents[token]) {
        tokenToComponents[token] = {
          tier: isComponentToken(token)
            ? 'component'
            : token.startsWith('--primitive-')
              ? 'primitive'
              : 'semantic',
          category: isComponentToken(token) ? 'component' : classifyToken(token),
          usedBy: [],
        };
      }

      const entry = { component: componentName };
      const props = propertyMap[token] || [];
      if (props.length > 0) entry.property = props[0];

      // Check if this token is used indirectly via a component token fallback
      const viaToken = Object.entries(fallbacks).find(([, sem]) => sem === token);
      if (viaToken && isComponentToken(viaToken[0])) {
        entry.via = viaToken[0];
      } else {
        entry.direct = true;
      }

      // Avoid duplicate entries
      if (!tokenToComponents[token].usedBy.some((u) => u.component === componentName)) {
        tokenToComponents[token].usedBy.push(entry);
      }
    }

    // Also register indirect usage: if --button-bg fallback is --color-action-primary,
    // button uses --color-action-primary indirectly
    for (const [compToken, semToken] of Object.entries(fallbacks)) {
      if (!tokenToComponents[semToken]) {
        tokenToComponents[semToken] = {
          tier: semToken.startsWith('--primitive-') ? 'primitive' : 'semantic',
          category: classifyToken(semToken),
          usedBy: [],
        };
      }
      if (!tokenToComponents[semToken].usedBy.some((u) => u.component === componentName)) {
        tokenToComponents[semToken].usedBy.push({
          component: componentName,
          property: (propertyMap[compToken] || [])[0] || null,
          via: compToken,
        });
      }
    }
  }

  // Sort usedBy arrays
  for (const token of Object.values(tokenToComponents)) {
    token.usedBy.sort((a, b) => a.component.localeCompare(b.component));
  }

  const output = {
    _generated: {
      warning: 'This file is auto-generated. Do not edit manually.',
      source: 'scripts/generate-docs.mjs',
      timestamp: NOW,
      command: 'pnpm generate-docs',
    },
    componentCount: Object.keys(componentToTokens).length,
    tokenCount: Object.keys(tokenToComponents).length,
    componentToTokens,
    tokenToComponents,
  };

  writeJSON(TOKEN_MAP_PATH, output);

  // Also write to playground data directory for the existing playground pages
  const playgroundDir = path.dirname(PLAYGROUND_TOKEN_MAP_PATH);
  if (fs.existsSync(playgroundDir)) {
    // Write playground-compatible format (maintaining existing shape)
    const playgroundOutput = {
      generatedAt: NOW,
      componentCount: Object.keys(componentToTokens).length,
      tokenCount: Object.keys(tokenToComponents).length,
      components: {},
      tokens: {},
      fallbackMap: {},
    };

    for (const { componentName, filePath } of cssFiles) {
      const cssContent = fs.readFileSync(filePath, 'utf-8');
      const allTokens = new Set();
      for (const m of matchAll(/var\(\s*(--[\w-]+)/g, cssContent)) allTokens.add(m[1]);
      const fallbacks2 = {};
      for (const m of matchAll(/var\(\s*(--[\w-]+)\s*,\s*var\(\s*(--[\w-]+)\s*\)/g, cssContent))
        fallbacks2[m[1]] = m[2];

      const sorted = Array.from(allTokens).sort();
      playgroundOutput.components[componentName] = {
        componentTokens: sorted.filter((t) => isComponentToken(t)),
        semanticTokens: sorted.filter((t) => !isComponentToken(t)),
        allTokens: sorted,
        fallbacks: fallbacks2,
        cssFile: path.relative(ROOT, filePath),
      };
      Object.assign(playgroundOutput.fallbackMap, fallbacks2);
    }

    for (const [tokenName, tokenData] of Object.entries(tokenToComponents)) {
      playgroundOutput.tokens[tokenName] = {
        usedBy: tokenData.usedBy.map((u) => u.component),
        tier: tokenData.tier,
        category: tokenData.category,
      };
    }

    writeJSON(PLAYGROUND_TOKEN_MAP_PATH, playgroundOutput);
  }

  console.log(
    `         ${Object.keys(componentToTokens).length} components, ${Object.keys(tokenToComponents).length} tokens`,
  );
  return output;
}

// ── GENERATOR 3: Component Inventory Markdown ───────────────────────────────

function runInventoryGenerator(manifest) {
  console.log('  [3/7] Component Inventory (COMPONENT-INVENTORY.md)...');

  // Categorize components from manifest
  const categoryMap = {
    primitives: 'Primitives',
    composites: 'Composites',
    patterns: 'Patterns',
    layout: 'Layout',
    other: 'Other',
  };

  // Map manifest categories to meaningful display categories
  const displayCategories = {};
  for (const comp of manifest.components || []) {
    const cat = categoryMap[comp.category] || 'Other';
    if (!displayCategories[cat]) displayCategories[cat] = [];
    displayCategories[cat].push(comp);
  }

  // Extract variants and sizes from props
  function getVariants(comp) {
    const variantProp = comp.props?.variant;
    if (variantProp?.values) return variantProp.values.join(', ');
    return '—';
  }

  function getSizes(comp) {
    const sizeProp = comp.props?.size;
    if (sizeProp?.values) return sizeProp.values.join(', ');
    return '—';
  }

  // Identify sub-components from index.ts (e.g., Card → CardHeader, CardBody, CardFooter)
  const indexSource = fs.readFileSync(INDEX_PATH, 'utf-8');
  function getSubComponents(compName) {
    const subCompRegex = new RegExp(`\\b(${compName}\\w+)\\b`, 'g');
    const subs = new Set();
    for (const m of matchAll(subCompRegex, indexSource)) {
      const sub = m[1];
      if (
        sub !== compName &&
        sub !== `${compName}Props` &&
        !sub.endsWith('Props') &&
        !sub.endsWith('Option') &&
        !sub.endsWith('Options')
      ) {
        subs.add(sub);
      }
    }
    return Array.from(subs).join(', ') || '—';
  }

  const totalComponents = (manifest.components || []).length;
  let md = '';
  md += '> **Auto-generated file.** Do not edit manually.\n';
  md += '> Source: `scripts/generate-docs.mjs`\n';
  md += '> Regenerate: `pnpm generate-docs`\n';
  md += `> Last generated: ${NOW}\n\n`;
  md += '# Component Inventory\n\n';
  md += `Total components: **${totalComponents}**\n\n`;

  const categoryOrder = ['Primitives', 'Composites', 'Layout', 'Patterns', 'Other'];
  for (const cat of categoryOrder) {
    const components = displayCategories[cat];
    if (!components || components.length === 0) continue;

    md += `## ${cat} (${components.length})\n\n`;
    md += '| Component | Variants | Sizes | Sub-components |\n';
    md += '|-----------|----------|-------|----------------|\n';

    for (const comp of components.sort((a, b) => a.name.localeCompare(b.name))) {
      md += `| ${comp.name} | ${getVariants(comp)} | ${getSizes(comp)} | ${getSubComponents(comp.name)} |\n`;
    }
    md += '\n';
  }

  // Hooks section
  if (manifest.hooks?.length) {
    md += `## Hooks (${manifest.hooks.length})\n\n`;
    md += '| Hook | Description |\n';
    md += '|------|-------------|\n';
    for (const hook of manifest.hooks) {
      md += `| ${hook.name} | ${hook.description || '—'} |\n`;
    }
    md += '\n';
  }

  writeFile(INVENTORY_PATH, md);
  console.log(`         ${totalComponents} components documented`);
}

// ── GENERATOR 4: Component Tokens Reference Markdown ────────────────────────

function runTokensDocGenerator(tokenMap) {
  console.log('  [4/7] Component Tokens Reference (COMPONENT-TOKENS.md)...');

  let md = '';
  md += '> **Auto-generated file.** Do not edit manually.\n';
  md += '> Source: `scripts/generate-docs.mjs`\n';
  md += '> Regenerate: `pnpm generate-docs`\n';
  md += `> Last generated: ${NOW}\n\n`;
  md += '# Component Token Reference\n\n';
  md += 'This document shows the complete token surface for each component.\n';
  md +=
    'Component tokens (tier 3) provide per-component overrides that fall back to semantic tokens (tier 2).\n\n';

  const components = tokenMap.componentToTokens;
  const sortedNames = Object.keys(components).sort();

  for (const compName of sortedNames) {
    const data = components[compName];
    const displayName =
      compName.charAt(0).toUpperCase() +
      compName.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    md += `## ${displayName}\n\n`;

    if (data.componentTokens.length > 0) {
      md += '### Component Tokens\n\n';
      md += '| Token | Default Fallback | CSS Property |\n';
      md += '|-------|-----------------|---------------|\n';
      for (const t of data.componentTokens) {
        md += `| \`${t.name}\` | ${t.fallback ? `\`${t.fallback}\`` : '—'} | ${t.property || '—'} |\n`;
      }
      md += '\n';
    }

    if (data.semanticTokens.length > 0) {
      md += '### Semantic Tokens Used\n\n';
      md += '| Token | CSS Property |\n';
      md += '|-------|--------------|\n';
      for (const t of data.semanticTokens) {
        md += `| \`${t.name}\` | ${t.property || '—'} |\n`;
      }
      md += '\n';
    }
  }

  writeFile(TOKENS_DOC_PATH, md);
  console.log(`         ${sortedNames.length} components documented`);
}

// ── GENERATOR 5: Export Verification ────────────────────────────────────────

function runExportVerification() {
  console.log('  [5/7] Export Verification...');

  const warnings = [];
  const indexSource = fs.readFileSync(INDEX_PATH, 'utf-8');

  // Get all component directories
  const componentDirs = getComponentDirs();

  for (const { name, category } of componentDirs) {
    if (category === 'layout') {
      // Layout exports are under './layout' not per-component dirs
      if (!indexSource.includes(`from './layout'`)) {
        warnings.push(
          `WARNING: Layout components exist but no export from './layout' found in index.ts`,
        );
      }
      continue;
    }

    // Check that the directory has a corresponding export (either by component name or path)
    const pathPattern = new RegExp(`from\\s+['"]\\./${category}/${name}['"]`);
    if (!pathPattern.test(indexSource)) {
      warnings.push(`WARNING: ${name} exists in ${category}/ but is not exported from index.ts`);
    }
  }

  // Check for type exports without matching component exports
  const typeExports = new Set();
  const valueExports = new Set();

  for (const match of matchAll(/export\s+type\s+\{([^}]+)\}\s+from/g, indexSource)) {
    for (const name of match[1]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)) {
      typeExports.add(name);
    }
  }
  for (const match of matchAll(/export\s+\{([^}]+)\}\s+from/g, indexSource)) {
    for (const name of match[1]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)) {
      valueExports.add(name);
    }
  }

  if (warnings.length > 0) {
    for (const w of warnings) {
      console.log(`         ${w}`);
    }
  } else {
    console.log('         All components exported correctly');
  }

  return warnings;
}

// ── GENERATOR 6: llms.txt and llms-full.txt ─────────────────────────────────

function runLlmsGenerator(manifest, tokenMap) {
  console.log('  [6/7] AI Agent Files (llms.txt, llms-full.txt)...');

  const themeCount = manifest.tokens?.themes?.length || 0;
  const compCount = manifest.components?.length || 0;
  const hookCount = manifest.hooks?.length || 0;

  // --- llms.txt: Short summary ---
  const shortParts = [
    '# Arcana UI\n',
    '> Auto-generated file. Do not edit manually.',
    '> Source: scripts/generate-docs.mjs | Regenerate: pnpm generate-docs',
    `> Last generated: ${NOW}\n`,
    'Arcana UI is a token-driven React design system for AI agents to assemble production-grade web interfaces.\n',
    '## Install\n',
    '```bash\nnpm install @arcana-ui/core @arcana-ui/tokens\n```\n',
    '## Quick Start\n',
    "```tsx\nimport '@arcana-ui/tokens/dist/arcana.css';\nimport { Button, Card, Input } from '@arcana-ui/core';\n\n// Theme switching\ndocument.documentElement.setAttribute('data-theme', 'dark');\n```\n",
    `## Themes (${themeCount})\n`,
  ];
  for (const theme of manifest.tokens?.themes || []) {
    shortParts.push(`- **${theme.id}**: ${theme.description}`);
  }
  shortParts.push('', `## Components (${compCount})\n`);
  for (const comp of manifest.components || []) {
    const desc = comp.props ? Object.keys(comp.props).slice(0, 3).join(', ') : '';
    shortParts.push(`- **${comp.name}** (${comp.category})${desc ? ` — props: ${desc}` : ''}`);
  }
  shortParts.push('', `## Hooks (${hookCount})\n`);
  for (const hook of manifest.hooks || []) {
    shortParts.push(`- **${hook.name}**${hook.description ? `: ${hook.description}` : ''}`);
  }
  shortParts.push(
    '',
    '## Full Reference\n',
    'See llms-full.txt for complete props, usage examples, and token reference.',
  );

  writeFile(LLMS_PATH, `${shortParts.join('\n')}\n`);

  // --- llms-full.txt: Complete reference ---
  const fullParts = [
    '# Arcana UI — Complete AI Agent Reference\n',
    '> Auto-generated file. Do not edit manually.',
    '> Source: scripts/generate-docs.mjs | Regenerate: pnpm generate-docs',
    `> Last generated: ${NOW}\n`,
    '## Overview\n',
    'Arcana UI is a token-driven React design system. Install:\n',
    '```bash\nnpm install @arcana-ui/core @arcana-ui/tokens\n```\n',
    'Import the CSS tokens and use components:\n',
    "```tsx\nimport '@arcana-ui/tokens/dist/arcana.css';\nimport { Button, Card, Input } from '@arcana-ui/core';\n```\n",
    '## Theme Switching\n',
    'Set the `data-theme` attribute on the root element:\n',
    "```tsx\ndocument.documentElement.setAttribute('data-theme', 'dark');\n```\n",
    `Available themes: ${(manifest.tokens?.themes || []).map((t) => `\`${t.id}\``).join(', ')}\n`,
  ];
  for (const theme of manifest.tokens?.themes || []) {
    fullParts.push(`- **${theme.id}**: ${theme.description}`);
  }
  fullParts.push(
    '',
    '## Token Architecture\n',
    'Three-tier system: Primitive → Semantic → Component\n',
    '- **Primitive**: Raw values (colors, spacing). Never used directly by components.',
    '- **Semantic**: Contextual tokens that reference primitives. Components use these.',
    '- **Component**: Optional per-component overrides (e.g., `--button-bg`).\n',
    'Override any token in CSS:\n',
    '```css\n:root {\n  --color-action-primary: #ff6600;\n  --button-radius: 0;\n}\n```\n',
    '### Key Tokens\n',
  );
  for (const [token, desc] of Object.entries(manifest.tokens?.keyTokens || {})) {
    fullParts.push(`- \`${token}\`: ${desc}`);
  }
  fullParts.push('', '## Component Reference\n');

  for (const comp of manifest.components || []) {
    fullParts.push(`### ${comp.name}\n`);
    fullParts.push(`\`\`\`tsx\n${comp.import}\n\`\`\`\n`);

    if (comp.props && Object.keys(comp.props).length > 0) {
      fullParts.push('| Prop | Type | Default | Description |');
      fullParts.push('|------|------|---------|-------------|');
      for (const [propName, propDef] of Object.entries(comp.props)) {
        const type = propDef.values
          ? propDef.values.map((v) => `'${v}'`).join(' \\| ')
          : propDef.type || 'unknown';
        const def = propDef.default !== undefined ? `\`${propDef.default}\`` : '—';
        const desc = propDef.description || '—';
        fullParts.push(`| ${propName} | ${type} | ${def} | ${desc} |`);
      }
      fullParts.push('');

      // Usage example
      const variantProp = comp.props.variant;
      const sizeProp = comp.props.size;
      if (variantProp?.values || sizeProp?.values) {
        fullParts.push('**Example:**\n');
        const exProps = [];
        if (variantProp?.values) exProps.push(`variant="${variantProp.values[0]}"`);
        if (sizeProp?.values) exProps.push(`size="${sizeProp.values[1] || sizeProp.values[0]}"`);
        fullParts.push(
          `\`\`\`tsx\n<${comp.name} ${exProps.join(' ')}>Content</${comp.name}>\n\`\`\`\n`,
        );
      }
    }

    // Component tokens from token map
    const compNameLower = comp.name
      .toLowerCase()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    const tokenData = tokenMap.componentToTokens?.[compNameLower];
    if (tokenData?.componentTokens?.length > 0) {
      fullParts.push('**Component Tokens:**\n');
      for (const t of tokenData.componentTokens) {
        fullParts.push(`- \`${t.name}\`${t.fallback ? ` (fallback: \`${t.fallback}\`)` : ''}`);
      }
      fullParts.push('');
    }
  }

  // Hooks reference
  fullParts.push('## Hooks Reference\n');
  for (const hook of manifest.hooks || []) {
    fullParts.push(`### ${hook.name}\n`);
    fullParts.push(`\`\`\`tsx\n${hook.import}\n\`\`\`\n`);
    if (hook.description) {
      fullParts.push(`${hook.description}\n`);
    }
  }

  const full = `${fullParts.join('\n')}\n`;
  writeFile(LLMS_FULL_PATH, full);

  const short = fs.readFileSync(LLMS_PATH, 'utf-8');
  const shortLines = short.split('\n').length;
  const fullLines = full.split('\n').length;
  console.log(`         llms.txt: ${shortLines} lines, llms-full.txt: ${fullLines} lines`);

  if (fullLines > 5000) {
    console.log(`         WARNING: llms-full.txt exceeds 5000 lines (${fullLines})`);
  }
}

// ── GENERATOR 7: Version Sync ───────────────────────────────────────────────

function runVersionSync() {
  console.log('  [7/7] Version Sync...');

  const corePkg = readJSON(CORE_PKG_PATH);
  const manifest = readJSON(MANIFEST_PATH);
  let changed = false;

  if (manifest.version !== corePkg.version) {
    console.log(`         Syncing version: ${manifest.version} → ${corePkg.version}`);
    manifest.version = corePkg.version;
    changed = true;
  }

  if (manifest.release?.version !== corePkg.version) {
    manifest.release = manifest.release || {};
    manifest.release.version = corePkg.version;
    manifest.release.releaseDate = new Date().toISOString().split('T')[0];
    changed = true;
  }

  // Verify CHANGELOG has entry for current version
  if (fs.existsSync(CHANGELOG_PATH)) {
    const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
    if (!changelog.includes('[Unreleased]') && !changelog.includes(`[${corePkg.version}]`)) {
      console.log(`         WARNING: CHANGELOG.md has no entry for version ${corePkg.version}`);
    }
  }

  if (changed) {
    writeJSON(MANIFEST_PATH, manifest);
    console.log(`         Version synced to ${corePkg.version}`);
  } else {
    console.log(`         Version ${corePkg.version} already in sync`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Arcana UI — Documentation Pipeline\n');
  const startTime = Date.now();

  // Run all generators in order
  const manifest = await runManifestGenerator();
  const tokenMap = runTokenMapGenerator();
  runInventoryGenerator(manifest);
  runTokensDocGenerator(tokenMap);
  const warnings = runExportVerification();
  runLlmsGenerator(manifest, tokenMap);
  runVersionSync();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} export warning(s) found.`);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
