---
version: alpha
name: Brutalist
description: Bloomberg Terminal meets Swiss poster - bold red accent, dramatic typography, thick structural borders
colors:
  primary: "#cc0000"
  secondary: "#ffffff"
  tertiary: "#cc0000"
  background: "#ffffff"
  surface: "#ffffff"
  elevated: "#ffffff"
  foreground: "#000000"
  foreground-muted: "#888888"
  border: "#000000"
  error: "#cc0000"
  on-primary: "#ffffff"
typography:
  headline-display:
    fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif"
    fontSize: 3rem
    fontWeight: 900
    lineHeight: 1
  headline-lg:
    fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif"
    fontSize: 2.25rem
    fontWeight: 900
    lineHeight: 1
  headline-md:
    fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif"
    fontSize: 1.875rem
    fontWeight: 900
    lineHeight: 1
  headline-sm:
    fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif"
    fontSize: 1.5rem
    fontWeight: 900
    lineHeight: 1
  body-lg:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1.25
  label-sm:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.25
  label-strong:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 700
    lineHeight: 1.25
  code-md:
    fontFamily: "'Courier New', Courier, monospace"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  display-xxl:
    fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif"
    fontSize: 4.5rem
    fontWeight: 900
    lineHeight: 1
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  2xl: 0px
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

# Brutalist

## Overview

Brutalist is the anti-skin preset. Zero radii, zero shadows, motion disabled at the component level. Blocks of solid color, hard typography, system-default fonts. For experimental, editorial, or art-directed surfaces where the design system should disappear.

Comfortable density on a strict grid: 16px base, no rounding, no transition between states.

## Colors

Brutalist centers on a single `primary` accent (`#cc0000`) on a `background` of `#ffffff`. Every accent / surface / foreground pair below has been measured against WCAG 2.1 contrast ratios; ratios at or above 4.5:1 clear AA at body size.

### WCAG contrast pairs

| Pair | Foreground | Background | Ratio | AA body | AA large |
| --- | --- | --- | --- | --- | --- |
| foreground on background | `#000000` | `#ffffff` | 21.00 | pass | pass |
| foreground on surface | `#000000` | `#ffffff` | 21.00 | pass | pass |
| foreground-muted on background | `#888888` | `#ffffff` | 3.54 | fail | pass |
| on-primary on primary | `#ffffff` | `#cc0000` | 5.89 | pass | pass |
| border on background | `#000000` | `#ffffff` | 21.00 | pass | pass |

## Typography

Display set in **Arial Black** for headline weight and presence; body in **Helvetica Neue** for sustained reading; **Courier New** for code, telemetry, and tabular data. Sizes use `clamp()` for fluid scaling between 320px and 1536px viewports so layouts settle without breakpoint-specific overrides.

Eleven typography levels are emitted in the front matter, grouped as headlines (display, lg, md, sm), body (lg, md, sm), labels (md, sm, strong), and code (md). Display runs as large as the 7xl scale token allows; the `display-xxl` level captures it.

## Layout

A 5-breakpoint grid: 640px (sm) -> 768px (md) -> 1024px (lg) -> 1280px (xl) -> 1536px (2xl). Mobile-first: every component renders at 320px and grows up from there. Visual regression baselines exist for each breakpoint so layout drift surfaces in CI.

Spacing follows a 4px base scale (`xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px`) with section-level rhythm at `section: 96px`. Touch targets stay at 44x44px minimum below the lg breakpoint.

## Elevation & Depth

Eight elevation tokens (`none, xs, sm, md, lg, xl, 2xl, inner`) plus role-named aliases (`card`, `card-hover`, `dropdown`, `modal`, `popover`, `toast`, `navbar`, `sidebar`). Shadows are tuned per preset; flat presets like Brutalist use `none` across the board and convey hierarchy through borders or color contrast instead.

Reference values: `sm = 3px 3px 0 0 rgba(0, 0, 0, 1)`, `md = 4px 4px 0 0 rgba(0, 0, 0, 1)`, `lg = 6px 6px 0 0 rgba(0, 0, 0, 1)`. Cards default to `sm`, hover lifts to `md`, modals sit at `xl`.

## Shapes

Default component radius is `0` for buttons, inputs, and badges; `0` for cards; `9999px` for pill-shaped elements (avatars, badges with rounded variants). Brutalist and Editorial presets override every radius to `0` for a hard, architectural shape language.

## Motion

Static: motion is disabled at the component level. Hover and focus states use color only, no transition.

Per-preset durations: `fast = 0ms`, `normal = 0ms`, `slow = 0ms`. All transitions collapse to `0ms` under `prefers-reduced-motion: reduce`. The Arcana `<FadeIn>`, `<Stagger>`, `<CountUp>`, and `<GradientBorder>` motion primitives respect this token chain end-to-end.

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
