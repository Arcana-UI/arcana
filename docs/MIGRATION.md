# Arcana UI — Token Migration Guide

> **Task:** 0.2 — Restructure token JSON to three-tier hierarchy
> **Date:** 2026-03-03
> **Status:** JSON structure migrated. CSS variable rename will happen when build pipeline is updated (task 0.4).

---

## Overview

The token system has been restructured from a flat two-file model (`base.json` + theme files) to a self-contained three-tier hierarchy per preset file. This document maps every old CSS variable name to its new JSON location and eventual new CSS variable name.

**Old structure:**
- `packages/tokens/src/base.json` — primitive values (colors, spacing, radius, shadows, motion, z-index, typography)
- `packages/tokens/src/light.json` — semantic theme values (surfaces, actions, text, borders, feedback)
- `packages/tokens/src/dark.json` — same structure, dark values
- `packages/tokens/src/presets/{terminal,retro98,glass,brutalist}.json` — same, not in build pipeline

**New structure:**
Each preset file (e.g. `packages/tokens/src/presets/light.json`) is self-contained with three tiers:
- `primitive` — raw values (replaces `base.json`)
- `semantic` — contextual tokens that reference primitives (replaces flat theme JSON)
- `component` — optional per-component overrides

---

## CSS Variable Name Mapping

When the build pipeline is updated (task 0.4), CSS variable names will change. This table maps old names to new names.

### Color — Background (surface → color-bg)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-surface-primary` | `semantic.color.background.page` | `--color-bg-page` |
| `--arcana-surface-secondary` | `semantic.color.background.surface` | `--color-bg-surface` |
| `--arcana-surface-tertiary` | `semantic.color.background.subtle` | `--color-bg-subtle` |
| `--arcana-surface-elevated` | `semantic.color.background.elevated` | `--color-bg-elevated` |
| `--arcana-surface-overlay` | `semantic.color.background.overlay` | `--color-bg-overlay` |
| `--arcana-surface-inverse` | *(dropped — see notes below)* | — |
| `--arcana-surface-canvas` | `semantic.color.background.sunken` | `--color-bg-sunken` |
| *(new)* | `semantic.color.background.subtle` | `--color-bg-subtle` |
| *(new)* | `semantic.color.background.sunken` | `--color-bg-sunken` |

### Color — Foreground (text → color-fg)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-text-primary` | `semantic.color.foreground.primary` | `--color-fg-primary` |
| `--arcana-text-secondary` | `semantic.color.foreground.secondary` | `--color-fg-secondary` |
| `--arcana-text-muted` | `semantic.color.foreground.muted` | `--color-fg-muted` |
| `--arcana-text-disabled` | `semantic.color.foreground.disabled` | `--color-fg-disabled` |
| `--arcana-text-inverse` | `semantic.color.foreground.inverse` | `--color-fg-inverse` |
| `--arcana-text-on-action` | `semantic.color.foreground.on-primary` | `--color-fg-on-primary` |
| `--arcana-text-on-danger` | `semantic.color.foreground.on-destructive` | `--color-fg-on-destructive` |
| `--arcana-text-link` | `semantic.color.foreground.link` | `--color-fg-link` |
| `--arcana-text-link-hover` | `semantic.color.foreground.link-hover` | `--color-fg-link-hover` |

### Color — Action (action → color-action)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-action-primary` | `semantic.color.action.primary.default` | `--color-action-primary` |
| `--arcana-action-primary-hover` | `semantic.color.action.primary.hover` | `--color-action-primary-hover` |
| `--arcana-action-primary-active` | `semantic.color.action.primary.active` | `--color-action-primary-active` |
| `--arcana-action-secondary` | `semantic.color.action.secondary.default` | `--color-action-secondary` |
| `--arcana-action-secondary-hover` | `semantic.color.action.secondary.hover` | `--color-action-secondary-hover` |
| `--arcana-action-secondary-active` | `semantic.color.action.secondary.active` | `--color-action-secondary-active` |
| `--arcana-action-danger` | `semantic.color.action.destructive.default` | `--color-action-destructive` |
| `--arcana-action-danger-hover` | `semantic.color.action.destructive.hover` | `--color-action-destructive-hover` |
| `--arcana-action-danger-active` | `semantic.color.action.destructive.active` | `--color-action-destructive-active` |
| `--arcana-action-ghost` | `semantic.color.action.ghost.default` | `--color-action-ghost` |
| `--arcana-action-ghost-hover` | `semantic.color.action.ghost.hover` | `--color-action-ghost-hover` |
| `--arcana-action-ghost-active` | `semantic.color.action.ghost.active` | `--color-action-ghost-active` |
| `--arcana-action-outline` | `semantic.color.action.outline.default` | `--color-action-outline` |
| `--arcana-action-outline-hover` | `semantic.color.action.outline.hover` | `--color-action-outline-hover` |

### Color — Border (border → color-border)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-border-default` | `semantic.color.border.default` | `--color-border-default` |
| `--arcana-border-strong` | `semantic.color.border.strong` | `--color-border-strong` |
| `--arcana-border-stronger` | `semantic.color.border.stronger` | `--color-border-stronger` |
| `--arcana-border-focus` | `semantic.color.border.focus` | `--color-border-focus` |
| `--arcana-border-error` | `semantic.color.border.error` | `--color-border-error` |
| `--arcana-border-inverse` | `semantic.color.border.inverse` | `--color-border-inverse` |

### Color — Status (feedback → color-status)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-feedback-success` | `semantic.color.status.success.default` | `--color-status-success` |
| `--arcana-feedback-success-bg` | `semantic.color.status.success.bg` | `--color-status-success-bg` |
| `--arcana-feedback-success-text` | `semantic.color.status.success.fg` | `--color-status-success-fg` |
| `--arcana-feedback-success-border` | `semantic.color.status.success.border` | `--color-status-success-border` |
| `--arcana-feedback-warning` | `semantic.color.status.warning.default` | `--color-status-warning` |
| `--arcana-feedback-warning-bg` | `semantic.color.status.warning.bg` | `--color-status-warning-bg` |
| `--arcana-feedback-warning-text` | `semantic.color.status.warning.fg` | `--color-status-warning-fg` |
| `--arcana-feedback-warning-border` | `semantic.color.status.warning.border` | `--color-status-warning-border` |
| `--arcana-feedback-error` | `semantic.color.status.error.default` | `--color-status-error` |
| `--arcana-feedback-error-bg` | `semantic.color.status.error.bg` | `--color-status-error-bg` |
| `--arcana-feedback-error-text` | `semantic.color.status.error.fg` | `--color-status-error-fg` |
| `--arcana-feedback-error-border` | `semantic.color.status.error.border` | `--color-status-error-border` |
| `--arcana-feedback-info` | `semantic.color.status.info.default` | `--color-status-info` |
| `--arcana-feedback-info-bg` | `semantic.color.status.info.bg` | `--color-status-info-bg` |
| `--arcana-feedback-info-text` | `semantic.color.status.info.fg` | `--color-status-info-fg` |
| `--arcana-feedback-info-border` | `semantic.color.status.info.border` | `--color-status-info-border` |

### Color — Primitives

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-color-white` | `primitive.color.white` | `--primitive-white` |
| `--arcana-color-stone-50` | `primitive.color.stone.50` | `--primitive-stone-50` |
| `--arcana-color-stone-100` ... `--arcana-color-stone-950` | `primitive.color.stone.{step}` | `--primitive-stone-{step}` |
| `--arcana-color-indigo-50` ... `--arcana-color-indigo-800` | `primitive.color.indigo.{step}` | `--primitive-indigo-{step}` |
| `--arcana-color-amber-400` ... `--arcana-color-amber-600` | `primitive.color.amber.{step}` | `--primitive-amber-{step}` |
| `--arcana-color-red-50` ... `--arcana-color-red-800` | `primitive.color.red.{step}` | `--primitive-red-{step}` |
| `--arcana-color-green-50` ... `--arcana-color-green-800` | `primitive.color.green.{step}` | `--primitive-green-{step}` |
| `--arcana-color-blue-50` ... `--arcana-color-blue-700` | `primitive.color.blue.{step}` | `--primitive-blue-{step}` |

### Typography

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-typography-font-family-sans` | `semantic.typography.family.body` | `--font-family-body` |
| *(new)* | `semantic.typography.family.display` | `--font-family-display` |
| `--arcana-typography-font-family-mono` | `semantic.typography.family.mono` | `--font-family-mono` |
| `--arcana-typography-font-size-xs` | `primitive.typography.fontSize.xs` | `--font-size-xs` |
| `--arcana-typography-font-size-sm` | `primitive.typography.fontSize.sm` | `--font-size-sm` |
| `--arcana-typography-font-size-base` | `primitive.typography.fontSize.base` | `--font-size-base` |
| `--arcana-typography-font-size-lg` | `primitive.typography.fontSize.lg` | `--font-size-lg` |
| `--arcana-typography-font-size-xl` | `primitive.typography.fontSize.xl` | `--font-size-xl` |
| `--arcana-typography-font-size-2xl` ... `--arcana-typography-font-size-5xl` | `primitive.typography.fontSize.{size}` | `--font-size-{size}` |
| `--arcana-typography-font-weight-normal` | `primitive.typography.fontWeight.normal` | `--font-weight-normal` |
| `--arcana-typography-font-weight-medium` | `primitive.typography.fontWeight.medium` | `--font-weight-medium` |
| `--arcana-typography-font-weight-semibold` | `primitive.typography.fontWeight.semibold` | `--font-weight-semibold` |
| `--arcana-typography-font-weight-bold` | `primitive.typography.fontWeight.bold` | `--font-weight-bold` |
| `--arcana-typography-line-height-none` | `primitive.typography.lineHeight.none` | `--line-height-none` |
| `--arcana-typography-line-height-tight` | `primitive.typography.lineHeight.tight` | `--line-height-tight` |
| `--arcana-typography-line-height-snug` | `primitive.typography.lineHeight.snug` | `--line-height-snug` |
| `--arcana-typography-line-height-normal` | `primitive.typography.lineHeight.normal` | `--line-height-normal` |
| `--arcana-typography-line-height-relaxed` | `primitive.typography.lineHeight.relaxed` | `--line-height-relaxed` |
| `--arcana-typography-line-height-loose` | `primitive.typography.lineHeight.loose` | `--line-height-loose` |
| `--arcana-typography-letter-spacing-tighter` | `primitive.typography.letterSpacing.tighter` | `--letter-spacing-tighter` |
| `--arcana-typography-letter-spacing-tight` | `primitive.typography.letterSpacing.tight` | `--letter-spacing-tight` |
| `--arcana-typography-letter-spacing-normal` | `primitive.typography.letterSpacing.normal` | `--letter-spacing-normal` |
| `--arcana-typography-letter-spacing-wide` | `primitive.typography.letterSpacing.wide` | `--letter-spacing-wide` |
| `--arcana-typography-letter-spacing-wider` | `primitive.typography.letterSpacing.wider` | `--letter-spacing-wider` |
| `--arcana-typography-letter-spacing-widest` | `primitive.typography.letterSpacing.widest` | `--letter-spacing-widest` |

### Spacing

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-spacing-0` | `primitive.spacing.0` | `--spacing-0` |
| `--arcana-spacing-px` | `primitive.spacing.px` | `--spacing-px` |
| `--arcana-spacing-0-5` | `primitive.spacing.0.5` | `--spacing-0-5` |
| `--arcana-spacing-1` | `primitive.spacing.1` | `--spacing-1` |
| `--arcana-spacing-1-5` ... `--arcana-spacing-32` | `primitive.spacing.{n}` | `--spacing-{n}` |
| *(new)* | `semantic.spacing.xs` | `--spacing-xs` |
| *(new)* | `semantic.spacing.sm` | `--spacing-sm` |
| *(new)* | `semantic.spacing.md` | `--spacing-md` |
| *(new)* | `semantic.spacing.lg` | `--spacing-lg` |
| *(new)* | `semantic.spacing.xl` | `--spacing-xl` |
| *(new)* | `semantic.spacing.2xl` | `--spacing-2xl` |
| *(new)* | `semantic.spacing.3xl` | `--spacing-3xl` |
| *(new)* | `semantic.spacing.section` | `--spacing-section` |

### Elevation (shadows)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-shadow-none` | `semantic.elevation.none` → `primitive.shadow.none` | `--shadow-none` |
| `--arcana-shadow-xs` | `semantic.elevation.xs` → `primitive.shadow.xs` | `--shadow-xs` |
| `--arcana-shadow-sm` | `semantic.elevation.sm` → `primitive.shadow.sm` | `--shadow-sm` |
| `--arcana-shadow-md` | `semantic.elevation.md` → `primitive.shadow.md` | `--shadow-md` |
| `--arcana-shadow-lg` | `semantic.elevation.lg` → `primitive.shadow.lg` | `--shadow-lg` |
| `--arcana-shadow-xl` | `semantic.elevation.xl` → `primitive.shadow.xl` | `--shadow-xl` |
| `--arcana-shadow-2xl` | `semantic.elevation.2xl` → `primitive.shadow.2xl` | `--shadow-2xl` |
| `--arcana-shadow-inner` | `semantic.elevation.inner` → `primitive.shadow.inner` | `--shadow-inner` |

### Z-Index

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-z-index-base` | `primitive.zIndex.base` | `--z-base` |
| `--arcana-z-index-raised` | `primitive.zIndex.raised` | `--z-raised` |
| `--arcana-z-index-dropdown` | `primitive.zIndex.dropdown` | `--z-dropdown` |
| `--arcana-z-index-sticky` | `primitive.zIndex.sticky` | `--z-sticky` |
| `--arcana-z-index-overlay` | `primitive.zIndex.overlay` | `--z-overlay` |
| `--arcana-z-index-modal` | `primitive.zIndex.modal` | `--z-modal` |
| `--arcana-z-index-toast` | `primitive.zIndex.toast` | `--z-toast` |
| `--arcana-z-index-tooltip` | `primitive.zIndex.tooltip` | `--z-tooltip` |

### Border & Shape

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-radius-none` | `semantic.radius.none` → `primitive.radius.none` | `--radius-none` |
| `--arcana-radius-xs` | `semantic.radius.xs` → `primitive.radius.xs` | `--radius-xs` |
| `--arcana-radius-sm` | `semantic.radius.sm` → `primitive.radius.sm` | `--radius-sm` |
| `--arcana-radius-md` | `semantic.radius.md` → `primitive.radius.md` | `--radius-md` |
| `--arcana-radius-lg` | `semantic.radius.lg` → `primitive.radius.lg` | `--radius-lg` |
| `--arcana-radius-xl` | `semantic.radius.xl` → `primitive.radius.xl` | `--radius-xl` |
| `--arcana-radius-2xl` | `semantic.radius.2xl` → `primitive.radius.2xl` | `--radius-2xl` |
| `--arcana-radius-full` | `semantic.radius.full` → `primitive.radius.full` | `--radius-full` |
| `--arcana-component-border-width` | `semantic.border.width.default` | `--border-width-default` |
| *(new)* | `semantic.border.width.thin` | `--border-width-thin` |
| *(new)* | `semantic.border.width.thick` | `--border-width-thick` |
| `--arcana-component-focus-ring` | `semantic.border.focus.ring` | `--focus-ring` |
| *(new)* | `semantic.border.focus.offset` | `--focus-offset` |

### Motion

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-motion-duration-instant` | `semantic.motion.duration.instant` → `primitive.motion.duration.instant` | `--duration-instant` |
| `--arcana-motion-duration-fast` | `semantic.motion.duration.fast` → `primitive.motion.duration.fast` | `--duration-fast` |
| `--arcana-motion-duration-normal` | `semantic.motion.duration.normal` → `primitive.motion.duration.normal` | `--duration-normal` |
| `--arcana-motion-duration-slow` | `semantic.motion.duration.slow` → `primitive.motion.duration.slow` | `--duration-slow` |
| `--arcana-motion-duration-slower` | `semantic.motion.duration.slower` → `primitive.motion.duration.slower` | `--duration-slower` |
| `--arcana-motion-easing-default` | `semantic.motion.easing.default` → `primitive.motion.easing.default` | `--ease-default` |
| `--arcana-motion-easing-in` | `semantic.motion.easing.in` → `primitive.motion.easing.in` | `--ease-in` |
| `--arcana-motion-easing-out` | `semantic.motion.easing.out` → `primitive.motion.easing.out` | `--ease-out` |
| `--arcana-motion-easing-spring` | `semantic.motion.easing.spring` → `primitive.motion.easing.spring` | `--ease-spring` |

### Component Tokens (tier 3)

| Old CSS Variable | New JSON Path | New CSS Variable (planned) |
|-----------------|---------------|---------------------------|
| `--arcana-component-radius` | `component.{name}.radius` | `--{name}-radius` |
| `--arcana-component-border-width` | `component.{name}.border-width` | `--{name}-border-width` |

---

## Tokens That Don't Map Cleanly

These existing tokens do not have a clean 1:1 mapping in the new structure. Recommendations are provided.

### Dropped Tokens (not carried forward)

| Old Token | Reason | Recommendation |
|-----------|--------|----------------|
| `--arcana-surface-inverse` | Not in ROADMAP target. Semantically ambiguous. | Use `--color-fg-inverse` for text-on-dark or `--color-bg-sunken` for contrasting backgrounds. |

### Renamed Concepts

| Old Concept | New Concept | Notes |
|-------------|-------------|-------|
| `surface.canvas` | `background.sunken` | "Canvas" was too vague. "Sunken" communicates the visual intent (recessed area). |
| `surface.tertiary` | `background.subtle` | "Tertiary" implies ordering. "Subtle" communicates the visual intent (barely visible). |
| `action.danger*` | `action.destructive*` | Aligns with ROADMAP naming. "Destructive" is clearer for irreversible actions. |
| `text.onAction` | `foreground.on-primary` | More specific — tells you which action surface. |
| `text.onDanger` | `foreground.on-destructive` | Matches action rename. |
| `feedback.*` | `status.*` | "Status" is the standard design system term. |
| `feedback.successText` | `status.success.fg` | Consistent with fg/bg naming. |
| `component.radius` | Per-component: `component.button.radius`, etc. | Component tokens are now scoped per-component, not global. |

### Extra Tokens Preserved (not in ROADMAP Appendix A but useful)

These tokens exist in the current system and are preserved in the new structure because they are actively used by components:

| Token | New Location | Used By |
|-------|-------------|---------|
| `foreground.disabled` | `semantic.color.foreground.disabled` | Input, Select, Textarea |
| `foreground.link` | `semantic.color.foreground.link` | General text links |
| `foreground.link-hover` | `semantic.color.foreground.link-hover` | General text links |
| `border.strong` | `semantic.color.border.strong` | Button, Checkbox, Radio, Card, Toggle |
| `border.stronger` | `semantic.color.border.stronger` | Table headers |
| `border.inverse` | `semantic.color.border.inverse` | Dark-on-light borders |
| `action.outline.*` | `semantic.color.action.outline.*` | Button outline variant |

---

## Migration Sequence

When the build pipeline is updated (task 0.4), the migration should proceed in this order:

1. **Build pipeline** reads new three-tier JSON, outputs new CSS variable names
2. **Backward compatibility layer** emits aliases mapping old names to new names
3. **Component CSS** is updated file-by-file to use new names (task 0.5+)
4. **Backward compatibility aliases** are removed once all components are migrated

---

## Files Changed in This Migration

### New Files
- `packages/tokens/src/schema/tokens.schema.json` — JSON Schema for token validation
- `docs/MIGRATION.md` — this file

### Restructured Files (overwritten with new format)
- `packages/tokens/src/presets/light.json` — canonical reference preset
- `packages/tokens/src/presets/dark.json`
- `packages/tokens/src/presets/terminal.json`
- `packages/tokens/src/presets/retro98.json`
- `packages/tokens/src/presets/glass.json`
- `packages/tokens/src/presets/brutalist.json`

### Files NOT Modified (preserved for backward compatibility until task 0.4)
- `packages/tokens/src/base.json` — old primitive file, still used by current build script
- `packages/tokens/src/light.json` — old light theme, still used by current build script
- `packages/tokens/src/dark.json` — old dark theme, still used by current build script
- `packages/tokens/scripts/build-tokens.ts` — will be rewritten in task 0.4
- All component CSS files — untouched per task constraints
