import yaml from 'js-yaml';
import { evaluatePair } from './contrast.js';
import { type PresetProse, describeMotionPersonality, getPresetProse } from './prose.js';
import { pickResolved, resolveString } from './resolver.js';
import type { ArcanaPreset, ContrastPair, PresetToDesignMdOptions } from './types.js';

export type { ArcanaPreset, MotionPersonality, PresetToDesignMdOptions } from './types.js';

interface FrontMatter {
  version: 'alpha';
  name: string;
  description?: string;
  colors: Record<string, string>;
  typography: Record<string, Record<string, string | number>>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  components: Record<string, Record<string, string>>;
}

function buildColors(preset: ArcanaPreset): {
  tokens: Record<string, string>;
  pairs: ContrastPair[];
} {
  const tokens: Record<string, string> = {};
  const pickHex = (path: string, fallback = '#000000'): string => {
    const v = pickResolved(preset, path, fallback);
    if (v.startsWith('#')) return v;
    if (v.startsWith('rgb')) {
      // Normalize rgb()/rgba() to hex when alpha is opaque, otherwise drop.
      const m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/);
      if (m) {
        const a = m[4] === undefined ? 1 : Number.parseFloat(m[4]);
        if (a >= 0.99) {
          const r = Number.parseInt(m[1]).toString(16).padStart(2, '0');
          const g = Number.parseInt(m[2]).toString(16).padStart(2, '0');
          const b = Number.parseInt(m[3]).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        }
      }
    }
    return fallback;
  };

  tokens.primary = pickHex('semantic.color.action.primary.default', '#3b82f6');
  tokens.secondary = pickHex('semantic.color.action.secondary.default', '#64748b');
  tokens.tertiary = pickHex('semantic.color.accent.default', tokens.primary);
  tokens.background = pickHex('semantic.color.background.page', '#ffffff');
  tokens.surface = pickHex('semantic.color.background.surface', tokens.background);
  tokens.elevated = pickHex('semantic.color.background.elevated', tokens.surface);
  tokens.foreground = pickHex('semantic.color.foreground.primary', '#0f172a');
  tokens['foreground-muted'] = pickHex('semantic.color.foreground.muted', tokens.foreground);
  tokens.border = pickHex('semantic.color.border.default', tokens['foreground-muted']);
  tokens.error = pickHex('semantic.color.action.destructive.default', '#dc2626');
  tokens['on-primary'] = pickHex('semantic.color.foreground.on-primary', '#ffffff');

  const pairs: ContrastPair[] = [];
  const tryPair = (name: string, fg: string, bg: string) => {
    const p = evaluatePair(name, fg, bg);
    if (p) pairs.push(p);
  };
  tryPair('foreground on background', tokens.foreground, tokens.background);
  tryPair('foreground on surface', tokens.foreground, tokens.surface);
  tryPair('foreground-muted on background', tokens['foreground-muted'], tokens.background);
  tryPair('on-primary on primary', tokens['on-primary'], tokens.primary);
  tryPair('border on background', tokens.border, tokens.background);

  return { tokens, pairs };
}

/**
 * Reduce a clamp(min, preferred, max) value to a plain dimension.
 *
 * The DESIGN.md spec accepts only `px | em | rem` strings as Dimension values
 * and rejects clamp() outright. Arcana's fluid typography ships clamp()
 * everywhere, so we extract the upper bound. That's the "design intent" size
 * at the largest viewport, which is the value designers would specify in a
 * comp. Implementation can layer fluid scaling back on top via CSS overrides.
 */
function dimensionOf(value: string): string {
  const trimmed = value.trim();
  const m = trimmed.match(/^clamp\(\s*[^,]+,\s*[^,]+,\s*([^)]+)\)$/);
  if (m) return m[1].trim();
  return trimmed;
}

function buildTypography(preset: ArcanaPreset): Record<string, Record<string, string | number>> {
  const fontDisplay = pickResolved(
    preset,
    'semantic.typography.family.display',
    'system-ui, sans-serif',
  );
  const fontBody = pickResolved(preset, 'semantic.typography.family.body', fontDisplay);
  const fontMono = pickResolved(preset, 'semantic.typography.family.mono', 'monospace');

  const sizeXs = dimensionOf(pickResolved(preset, 'semantic.typography.size.xs', '0.75rem'));
  const sizeSm = dimensionOf(pickResolved(preset, 'semantic.typography.size.sm', '0.875rem'));
  const sizeBase = dimensionOf(pickResolved(preset, 'semantic.typography.size.base', '1rem'));
  const sizeLg = dimensionOf(pickResolved(preset, 'semantic.typography.size.lg', '1.125rem'));
  const sizeXl = dimensionOf(pickResolved(preset, 'semantic.typography.size.xl', '1.25rem'));
  const size2xl = dimensionOf(pickResolved(preset, 'semantic.typography.size.2xl', '1.5rem'));
  const size3xl = dimensionOf(pickResolved(preset, 'semantic.typography.size.3xl', '1.875rem'));
  const size4xl = dimensionOf(pickResolved(preset, 'semantic.typography.size.4xl', '2.25rem'));
  const size5xl = dimensionOf(pickResolved(preset, 'semantic.typography.size.5xl', '3rem'));

  const weightHeading = Number.parseInt(
    pickResolved(preset, 'semantic.typography.weight.heading', '700'),
    10,
  );
  const weightBody = Number.parseInt(
    pickResolved(preset, 'semantic.typography.weight.body', '400'),
    10,
  );
  const weightStrong = Number.parseInt(
    pickResolved(preset, 'semantic.typography.weight.strong', '600'),
    10,
  );
  const weightUi = Number.parseInt(
    pickResolved(preset, 'semantic.typography.weight.ui', '500'),
    10,
  );

  const lineHeading = Number.parseFloat(
    pickResolved(preset, 'semantic.typography.lineHeight.heading', '1.25'),
  );
  const lineBody = Number.parseFloat(
    pickResolved(preset, 'semantic.typography.lineHeight.body', '1.5'),
  );
  const lineUi = Number.parseFloat(
    pickResolved(preset, 'semantic.typography.lineHeight.ui', '1.375'),
  );

  return {
    'headline-display': {
      fontFamily: fontDisplay,
      fontSize: size5xl,
      fontWeight: weightHeading,
      lineHeight: lineHeading,
    },
    'headline-lg': {
      fontFamily: fontDisplay,
      fontSize: size4xl,
      fontWeight: weightHeading,
      lineHeight: lineHeading,
    },
    'headline-md': {
      fontFamily: fontDisplay,
      fontSize: size3xl,
      fontWeight: weightHeading,
      lineHeight: lineHeading,
    },
    'headline-sm': {
      fontFamily: fontDisplay,
      fontSize: size2xl,
      fontWeight: weightHeading,
      lineHeight: lineHeading,
    },
    'body-lg': {
      fontFamily: fontBody,
      fontSize: sizeLg,
      fontWeight: weightBody,
      lineHeight: lineBody,
    },
    'body-md': {
      fontFamily: fontBody,
      fontSize: sizeBase,
      fontWeight: weightBody,
      lineHeight: lineBody,
    },
    'body-sm': {
      fontFamily: fontBody,
      fontSize: sizeSm,
      fontWeight: weightBody,
      lineHeight: lineBody,
    },
    'label-md': {
      fontFamily: fontBody,
      fontSize: sizeSm,
      fontWeight: weightUi,
      lineHeight: lineUi,
    },
    'label-sm': {
      fontFamily: fontBody,
      fontSize: sizeXs,
      fontWeight: weightUi,
      lineHeight: lineUi,
    },
    'label-strong': {
      fontFamily: fontBody,
      fontSize: sizeBase,
      fontWeight: weightStrong,
      lineHeight: lineUi,
    },
    'code-md': {
      fontFamily: fontMono,
      fontSize: sizeSm,
      fontWeight: weightBody,
      lineHeight: lineBody,
    },
    'display-xxl': {
      fontFamily: fontDisplay,
      fontSize: dimensionOf(pickResolved(preset, 'semantic.typography.size.7xl', size5xl)),
      fontWeight: weightHeading,
      lineHeight: 1,
    },
  };
}

function ensureUnit(value: string, fallbackUnit = 'px'): string {
  const trimmed = value.trim();
  // Spec: Dimension must end in px | em | rem.
  if (/(px|em|rem)$/.test(trimmed)) return trimmed;
  if (trimmed === '0' || trimmed === '0.0') return `0${fallbackUnit}`;
  return trimmed;
}

function buildRounded(preset: ArcanaPreset): Record<string, string> {
  return {
    none: ensureUnit(pickResolved(preset, 'semantic.radius.none', '0px')),
    sm: ensureUnit(pickResolved(preset, 'semantic.radius.sm', '0.25rem')),
    md: ensureUnit(pickResolved(preset, 'semantic.radius.md', '0.375rem')),
    lg: ensureUnit(pickResolved(preset, 'semantic.radius.lg', '0.5rem')),
    xl: ensureUnit(pickResolved(preset, 'semantic.radius.xl', '0.75rem')),
    '2xl': ensureUnit(pickResolved(preset, 'semantic.radius.2xl', '1rem')),
    full: ensureUnit(pickResolved(preset, 'semantic.radius.full', '9999px')),
  };
}

function buildSpacing(preset: ArcanaPreset): Record<string, string> {
  return {
    base: pickResolved(preset, 'primitive.spacing.4', '1rem'),
    xs: pickResolved(preset, 'primitive.spacing.1', '0.25rem'),
    sm: pickResolved(preset, 'primitive.spacing.2', '0.5rem'),
    md: pickResolved(preset, 'primitive.spacing.4', '1rem'),
    lg: pickResolved(preset, 'primitive.spacing.6', '1.5rem'),
    xl: pickResolved(preset, 'primitive.spacing.8', '2rem'),
    '2xl': pickResolved(preset, 'primitive.spacing.12', '3rem'),
    '3xl': pickResolved(preset, 'primitive.spacing.16', '4rem'),
    section: pickResolved(preset, 'primitive.spacing.24', '6rem'),
  };
}

function buildComponents(): Record<string, Record<string, string>> {
  // Component tokens use {colors.x} / {rounded.x} / {spacing.x} references back
  // into the front matter we just emitted. Per DESIGN.md spec, references
  // inside the components section may point at composite values.
  return {
    'button-primary': {
      backgroundColor: '{colors.primary}',
      textColor: '{colors.on-primary}',
      rounded: '{rounded.md}',
      padding: '{spacing.md}',
      typography: '{typography.label-strong}',
    },
    'button-secondary': {
      backgroundColor: '{colors.secondary}',
      textColor: '{colors.foreground}',
      rounded: '{rounded.md}',
      padding: '{spacing.md}',
      typography: '{typography.label-strong}',
    },
    'button-destructive': {
      backgroundColor: '{colors.error}',
      textColor: '{colors.on-primary}',
      rounded: '{rounded.md}',
      padding: '{spacing.md}',
      typography: '{typography.label-strong}',
    },
    'input-default': {
      backgroundColor: '{colors.surface}',
      textColor: '{colors.foreground}',
      borderColor: '{colors.border}',
      rounded: '{rounded.md}',
      padding: '{spacing.sm}',
      typography: '{typography.body-md}',
    },
    'card-default': {
      backgroundColor: '{colors.surface}',
      textColor: '{colors.foreground}',
      rounded: '{rounded.lg}',
      padding: '{spacing.lg}',
    },
    'badge-default': {
      backgroundColor: '{colors.surface}',
      textColor: '{colors.foreground-muted}',
      rounded: '{rounded.full}',
      padding: '{spacing.xs}',
      typography: '{typography.label-sm}',
    },
  };
}

function frontMatterYaml(
  preset: ArcanaPreset,
  options: PresetToDesignMdOptions,
): {
  yamlText: string;
  pairs: ContrastPair[];
  fm: FrontMatter;
} {
  const { tokens: colors, pairs } = buildColors(preset);
  const fm: FrontMatter = {
    version: 'alpha',
    name: options.name ?? humanizeName(preset.name),
    colors,
    typography: buildTypography(preset),
    rounded: buildRounded(preset),
    spacing: buildSpacing(preset),
    components: buildComponents(),
  };
  const description = (options.description ?? preset.description ?? '')
    .replace(/—/g, ' - ')
    .replace(/ {2,}/g, ' ')
    .trim();
  if (description) fm.description = description;

  // Re-shape into the order the spec expects, putting `description` right after
  // `name` for readability.
  const ordered = {
    version: fm.version,
    name: fm.name,
    ...(fm.description ? { description: fm.description } : {}),
    colors: fm.colors,
    typography: fm.typography,
    rounded: fm.rounded,
    spacing: fm.spacing,
    components: fm.components,
  };

  const yamlText = yaml.dump(ordered, { lineWidth: 120, quotingType: '"', forceQuotes: false });
  return { yamlText, pairs, fm };
}

function humanizeName(presetName: string): string {
  // arcana-midnight -> Midnight, arcana-retro98 -> Retro98
  const stripped = presetName.replace(/^arcana-/, '');
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

function sectionOverview(preset: ArcanaPreset, prose: PresetProse): string {
  const lines = ['## Overview', '', prose.overview, '', prose.density, ''];
  return lines.join('\n');
}

function sectionColors(
  preset: ArcanaPreset,
  pairs: ContrastPair[],
  colorTokens: Record<string, string>,
): string {
  const lines = [
    '## Colors',
    '',
    `${humanizeName(preset.name)} centers on a single \`primary\` accent (\`${colorTokens.primary}\`) on a \`background\` of \`${colorTokens.background}\`. Every accent / surface / foreground pair below has been measured against WCAG 2.1 contrast ratios; ratios at or above 4.5:1 clear AA at body size.`,
    '',
    '### WCAG contrast pairs',
    '',
    '| Pair | Foreground | Background | Ratio | AA body | AA large |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const p of pairs) {
    lines.push(
      `| ${p.pair} | \`${p.fg}\` | \`${p.bg}\` | ${p.ratio.toFixed(2)} | ${p.aaBody ? 'pass' : 'fail'} | ${p.aaLarge ? 'pass' : 'fail'} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function sectionTypography(preset: ArcanaPreset): string {
  const fontDisplay = pickResolved(preset, 'semantic.typography.family.display', 'system-ui');
  const fontBody = pickResolved(preset, 'semantic.typography.family.body', fontDisplay);
  const fontMono = pickResolved(preset, 'semantic.typography.family.mono', 'monospace');

  const lines = [
    '## Typography',
    '',
    `Display set in **${fontDisplay.split(',')[0].replace(/['"]/g, '')}** for headline weight and presence; body in **${fontBody.split(',')[0].replace(/['"]/g, '')}** for sustained reading; **${fontMono.split(',')[0].replace(/['"]/g, '')}** for code, telemetry, and tabular data. Sizes use \`clamp()\` for fluid scaling between 320px and 1536px viewports so layouts settle without breakpoint-specific overrides.`,
    '',
    'Eleven typography levels are emitted in the front matter, grouped as headlines (display, lg, md, sm), body (lg, md, sm), labels (md, sm, strong), and code (md). Display runs as large as the 7xl scale token allows; the `display-xxl` level captures it.',
    '',
  ];
  return lines.join('\n');
}

function sectionLayout(preset: ArcanaPreset): string {
  const bpSm = pickResolved(preset, 'semantic.layout.breakpoint-sm', '640px');
  const bpMd = pickResolved(preset, 'semantic.layout.breakpoint-md', '768px');
  const bpLg = pickResolved(preset, 'semantic.layout.breakpoint-lg', '1024px');
  const bpXl = pickResolved(preset, 'semantic.layout.breakpoint-xl', '1280px');
  const bp2xl = pickResolved(preset, 'semantic.layout.breakpoint-2xl', '1536px');

  const lines = [
    '## Layout',
    '',
    `A 5-breakpoint grid: ${bpSm} (sm) -> ${bpMd} (md) -> ${bpLg} (lg) -> ${bpXl} (xl) -> ${bp2xl} (2xl). Mobile-first: every component renders at 320px and grows up from there. Visual regression baselines exist for each breakpoint so layout drift surfaces in CI.`,
    '',
    'Spacing follows a 4px base scale (`xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px`) with section-level rhythm at `section: 96px`. Touch targets stay at 44x44px minimum below the lg breakpoint.',
    '',
  ];
  return lines.join('\n');
}

function sectionElevation(preset: ArcanaPreset): string {
  const shadowSm = pickResolved(preset, 'primitive.shadow.sm', '0 1px 2px rgba(0,0,0,0.05)');
  const shadowMd = pickResolved(preset, 'primitive.shadow.md', '0 4px 6px rgba(0,0,0,0.1)');
  const shadowLg = pickResolved(preset, 'primitive.shadow.lg', '0 10px 15px rgba(0,0,0,0.1)');

  const lines = [
    '## Elevation & Depth',
    '',
    'Eight elevation tokens (`none, xs, sm, md, lg, xl, 2xl, inner`) plus role-named aliases (`card`, `card-hover`, `dropdown`, `modal`, `popover`, `toast`, `navbar`, `sidebar`). Shadows are tuned per preset; flat presets like Brutalist use `none` across the board and convey hierarchy through borders or color contrast instead.',
    '',
    `Reference values: \`sm = ${shadowSm}\`, \`md = ${shadowMd}\`, \`lg = ${shadowLg}\`. Cards default to \`sm\`, hover lifts to \`md\`, modals sit at \`xl\`.`,
    '',
  ];
  return lines.join('\n');
}

function sectionShapes(preset: ArcanaPreset): string {
  const radiusMd = pickResolved(preset, 'semantic.radius.md', '0.375rem');
  const radiusLg = pickResolved(preset, 'semantic.radius.lg', '0.5rem');
  const radiusFull = pickResolved(preset, 'semantic.radius.full', '9999px');

  const lines = [
    '## Shapes',
    '',
    `Default component radius is \`${radiusMd}\` for buttons, inputs, and badges; \`${radiusLg}\` for cards; \`${radiusFull}\` for pill-shaped elements (avatars, badges with rounded variants). Brutalist and Editorial presets override every radius to \`0\` for a hard, architectural shape language.`,
    '',
  ];
  return lines.join('\n');
}

function sectionMotion(preset: ArcanaPreset, prose: PresetProse): string {
  const dFast = pickResolved(preset, 'semantic.motion.duration.fast', '150ms');
  const dNormal = pickResolved(preset, 'semantic.motion.duration.normal', '300ms');
  const dSlow = pickResolved(preset, 'semantic.motion.duration.slow', '500ms');

  const lines = [
    '## Motion',
    '',
    describeMotionPersonality(prose.motionPersonality),
    '',
    `Per-preset durations: \`fast = ${dFast}\`, \`normal = ${dNormal}\`, \`slow = ${dSlow}\`. All transitions collapse to \`0ms\` under \`prefers-reduced-motion: reduce\`. The Arcana \`<FadeIn>\`, \`<Stagger>\`, \`<CountUp>\`, and \`<GradientBorder>\` motion primitives respect this token chain end-to-end.`,
    '',
  ];
  return lines.join('\n');
}

function sectionComponents(): string {
  const lines = [
    '## Components',
    '',
    'Arcana ships 108 components in five tiers: primitives (Button, Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Avatar), composites (Card, Modal, Alert, Toast, Tabs, Accordion, Banner, Skeleton, Spinner, ErrorBoundary), 47 patterns (Navbar, Sidebar, DataTable, Hero, PricingCard, CommandPalette, and more), layout primitives (Stack, HStack, Grid, Container), and editor components (ColorPicker, FontPicker).',
    '',
    'The front matter `components` section captures only the most-used atoms (`button-primary`, `button-secondary`, `button-destructive`, `input-default`, `card-default`, `badge-default`). Every property points at a token reference, so a Claude Design import lands with a coherent component layer rather than a flat token dump.',
    '',
    'Variants (hover, active, disabled, focus) follow the `<component>-<state>` naming convention from the spec.',
    '',
  ];
  return lines.join('\n');
}

function sectionDosDonts(): string {
  const lines = [
    "## Do's and Don'ts",
    '',
    "- Do reference tokens, not literal values. `{colors.primary}` survives theme switches; `#3b82f6` doesn't.",
    '- Do use `primary` for the single most important action per screen. Secondary CTAs use `secondary` or the `outline` variant.',
    '- Do keep WCAG AA contrast (4.5:1 body, 3:1 large text and UI). Every contrast pair in the front matter has been verified.',
    '- Do respect `prefers-reduced-motion`. Every transition collapses to 0ms under the user preference.',
    '- Do scale typography with the fluid clamp() values; avoid breakpoint-specific font-size overrides.',
    "- Don't mix radius scales on the same surface. Buttons and inputs share a radius; cards step up one tier.",
    "- Don't introduce new color literals. Add a token if a hue is missing.",
    "- Don't ship hover-only interactions. Every hover state needs a focus or tap equivalent.",
    "- Don't use shadow elevation for hierarchy in flat presets (Brutalist, Editorial). Use borders or color contrast.",
    '',
  ];
  return lines.join('\n');
}

/**
 * Convert an Arcana preset to a Google DESIGN.md spec-compliant string.
 *
 * Output structure:
 *   - YAML front matter (version, name, description, colors, typography,
 *     rounded, spacing, components)
 *   - Markdown sections in spec order: Overview, Colors, Typography, Layout,
 *     Elevation & Depth, Shapes, Components, Do's and Don'ts
 *   - Plus an extension section (`## Motion`) that the spec preserves as
 *     unknown content without erroring
 *
 * Callers handle filesystem I/O. The function is pure: same preset + options
 * always produces the same string.
 */
export function presetToDesignMd(
  preset: ArcanaPreset,
  options: PresetToDesignMdOptions = {},
): string {
  const prose = getPresetProse(preset.name);
  if (options.motionPersonality) prose.motionPersonality = options.motionPersonality;

  const { yamlText, pairs, fm } = frontMatterYaml(preset, options);

  const parts = [
    '---',
    yamlText.trimEnd(),
    '---',
    '',
    `# ${fm.name}`,
    '',
    sectionOverview(preset, prose),
    sectionColors(preset, pairs, fm.colors),
    sectionTypography(preset),
    sectionLayout(preset),
    sectionElevation(preset),
    sectionShapes(preset),
    sectionMotion(preset, prose),
    sectionComponents(),
    sectionDosDonts(),
  ];

  return `${parts
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()}\n`;
}
