---
version: alpha
name: Editorial
description: Elegant serif typography, high contrast - publishing, NYT-inspired
colors:
  primary: "#1c1917"
  secondary: "#f5f5f4"
  tertiary: "#1c1917"
  background: "#faf8f5"
  surface: "#fafaf9"
  elevated: "#ffffff"
  foreground: "#1c1917"
  foreground-muted: "#a8a29e"
  border: "#d6d3d1"
  error: "#b91c1c"
  on-primary: "#ffffff"
typography:
  headline-display:
    fontFamily: "'Playfair Display', 'EB Garamond', Georgia, serif"
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.25
  headline-lg:
    fontFamily: "'Playfair Display', 'EB Garamond', Georgia, serif"
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.25
  headline-md:
    fontFamily: "'Playfair Display', 'EB Garamond', Georgia, serif"
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.25
  headline-sm:
    fontFamily: "'Playfair Display', 'EB Garamond', Georgia, serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
  body-lg:
    fontFamily: "'Source Serif 4', 'Libre Baskerville', Georgia, serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "'Source Serif 4', 'Libre Baskerville', Georgia, serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "'Source Serif 4', 'Libre Baskerville', Georgia, serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "'Source Serif 4', 'Libre Baskerville', Georgia, serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.375
  label-sm:
    fontFamily: "'Source Serif 4', 'Libre Baskerville', Georgia, serif"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.375
  label-strong:
    fontFamily: "'Source Serif 4', 'Libre Baskerville', Georgia, serif"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.375
  code-md:
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  display-xxl:
    fontFamily: "'Playfair Display', 'EB Garamond', Georgia, serif"
    fontSize: 4.5rem
    fontWeight: 700
    lineHeight: 1
rounded:
  none: 0px
  sm: 0.125rem
  md: 0.1875rem
  lg: 0.25rem
  xl: 0.375rem
  2xl: 0.5rem
  full: 9999px
spacing:
  base: 1rem
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  3xl: 4rem
  section: 6rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    typography: "{typography.label-strong}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    typography: "{typography.label-strong}"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    typography: "{typography.label-strong}"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    typography: "{typography.body-md}"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  badge-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground-muted}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs}"
    typography: "{typography.label-sm}"
---

# Editorial

## Overview

Editorial is calm, prose-first, and zero-radius. Built for long-form reading: news, magazines, essay platforms. Generous line-height, restrained accents, typography sized for sustained attention rather than scanning.

Spacious density: 20px base spacing, 1.625-1.75 line-height for body, narrow content column for prose.

## Colors

Editorial centers on a single `primary` accent (`#1c1917`) on a `background` of `#faf8f5`. Every accent / surface / foreground pair below has been measured against WCAG 2.1 contrast ratios; ratios at or above 4.5:1 clear AA at body size.

### WCAG contrast pairs

| Pair | Foreground | Background | Ratio | AA body | AA large |
| --- | --- | --- | --- | --- | --- |
| foreground on background | `#1c1917` | `#faf8f5` | 16.50 | pass | pass |
| foreground on surface | `#1c1917` | `#fafaf9` | 16.74 | pass | pass |
| foreground-muted on background | `#a8a29e` | `#faf8f5` | 2.38 | fail | fail |
| on-primary on primary | `#ffffff` | `#1c1917` | 17.49 | pass | pass |
| border on background | `#d6d3d1` | `#faf8f5` | 1.41 | fail | fail |

## Typography

Display set in **Playfair Display** for headline weight and presence; body in **Source Serif 4** for sustained reading; **IBM Plex Mono** for code, telemetry, and tabular data. Sizes use `clamp()` for fluid scaling between 320px and 1536px viewports so layouts settle without breakpoint-specific overrides.

Eleven typography levels are emitted in the front matter, grouped as headlines (display, lg, md, sm), body (lg, md, sm), labels (md, sm, strong), and code (md). Display runs as large as the 7xl scale token allows; the `display-xxl` level captures it.

## Layout

A 5-breakpoint grid: 640px (sm) -> 768px (md) -> 1024px (lg) -> 1280px (xl) -> 1536px (2xl). Mobile-first: every component renders at 320px and grows up from there. Visual regression baselines exist for each breakpoint so layout drift surfaces in CI.

Spacing follows a 4px base scale (`xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px`) with section-level rhythm at `section: 96px`. Touch targets stay at 44x44px minimum below the lg breakpoint.

## Elevation & Depth

Eight elevation tokens (`none, xs, sm, md, lg, xl, 2xl, inner`) plus role-named aliases (`card`, `card-hover`, `dropdown`, `modal`, `popover`, `toast`, `navbar`, `sidebar`). Shadows are tuned per preset; flat presets like Brutalist use `none` across the board and convey hierarchy through borders or color contrast instead.

Reference values: `sm = 0 1px 2px 0 rgba(28, 25, 23, 0.04)`, `md = 0 2px 8px -2px rgba(28, 25, 23, 0.06)`, `lg = 0 8px 16px -4px rgba(28, 25, 23, 0.08)`. Cards default to `sm`, hover lifts to `md`, modals sit at `xl`.

## Shapes

Default component radius is `0.1875rem` for buttons, inputs, and badges; `0.25rem` for cards; `9999px` for pill-shaped elements (avatars, badges with rounded variants). Brutalist and Editorial presets override every radius to `0` for a hard, architectural shape language.

## Motion

Calm: durations slightly longer than default, easings lean ease-in-out. Reveals settle rather than snap.

Per-preset durations: `fast = 180ms`, `normal = 300ms`, `slow = 450ms`. All transitions collapse to `0ms` under `prefers-reduced-motion: reduce`. The Arcana `<FadeIn>`, `<Stagger>`, `<CountUp>`, and `<GradientBorder>` motion primitives respect this token chain end-to-end.

## Components

Arcana ships 108 components in five tiers: primitives (Button, Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Avatar), composites (Card, Modal, Alert, Toast, Tabs, Accordion, Banner, Skeleton, Spinner, ErrorBoundary), 47 patterns (Navbar, Sidebar, DataTable, Hero, PricingCard, CommandPalette, and more), layout primitives (Stack, HStack, Grid, Container), and editor components (ColorPicker, FontPicker).

The front matter `components` section captures only the most-used atoms (`button-primary`, `button-secondary`, `button-destructive`, `input-default`, `card-default`, `badge-default`). Every property points at a token reference, so a Claude Design import lands with a coherent component layer rather than a flat token dump.

Variants (hover, active, disabled, focus) follow the `<component>-<state>` naming convention from the spec.

## Do's and Don'ts

- Do reference tokens, not literal values. `{colors.primary}` survives theme switches; `#3b82f6` doesn't.
- Do use `primary` for the single most important action per screen. Secondary CTAs use `secondary` or the `outline` variant.
- Do keep WCAG AA contrast (4.5:1 body, 3:1 large text and UI). Every contrast pair in the front matter has been verified.
- Do respect `prefers-reduced-motion`. Every transition collapses to 0ms under the user preference.
- Do scale typography with the fluid clamp() values; avoid breakpoint-specific font-size overrides.
- Don't mix radius scales on the same surface. Buttons and inputs share a radius; cards step up one tier.
- Don't introduce new color literals. Add a token if a hue is missing.
- Don't ship hover-only interactions. Every hover state needs a focus or tap equivalent.
- Don't use shadow elevation for hierarchy in flat presets (Brutalist, Editorial). Use borders or color contrast.
