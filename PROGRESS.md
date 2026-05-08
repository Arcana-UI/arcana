# Arcana UI -- Progress Tracker

> **Last updated:** 2026-05-08
> **Current version:** v0.1.2 (`@arcana-ui/core` only; tokens / cli / mcp remain at 0.1.0).
> **Current sprint:** Tree-shaking release shipped (single-component import 278 kB → 2.2 kB). KV→Supabase, landing polish (3 PRs), useTheme tests, 0.1.1 CSS-module hotfix, and 5.9 tree-shaking all closed. Phase O still parked.
> **Source of truth for current state:** CLAUDE.md "Current State" section.
> **Next priority:** (1) Cut 0.1.2 release (Bear), (2) DESIGN.md export (5.12, urgent post-Google-Labs spec release), (3) Claude Design integration pack (P.14), (4) Finish docs site scaffold (5.5).

---

## Release Status

| Package | Version | npm | Status |
|---------|---------|-----|--------|
| `@arcana-ui/tokens` | 0.1.0 | Published | Stable |
| `@arcana-ui/core` | 0.1.2 | Published | Stable; 0.1.2 ships per-component entry points for tree-shaking (278 kB → 2.2 kB single-component import) |
| `@arcana-ui/cli` | 0.1.0 | Published | Stable |
| `@arcana-ui/mcp` | 0.1.0 | Published | Stable, transitive `hono` advisories tracked in KNOWN_ISSUES.md |

---

## Phases 0-3: Complete

All foundation work, token system (2,600+ CSS variables), responsive framework (5-breakpoint visual regression suite), and component library built. 14 theme presets. Test infrastructure, CI/CD, and npm publish done.

- **Primitives:** 9 (Button, Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Avatar)
- **Composites:** 10 (Accordion, Alert, Banner, Card, ErrorBoundary, Modal, Skeleton, Spinner, Tabs, Toast)
- **Patterns:** 47 (Navbar, Sidebar, DataTable, Hero, PricingCard, CommandPalette, etc.)
- **Playground components:** 2 (ColorPicker, FontPicker)
- **Layout:** 1 (Layout)
- **Hooks:** 8 (useTheme, useBreakpoint, useClickOutside, useDrag, useFloating, useHotkey, useMediaQuery, usePrefersReducedMotion, useUndoRedo)
- **Total named exports:** 114 (108 components per manifest.ai.json)

---

## Phase 4: Demo Sites -- COMPLETE

- [x] 4.1 -- Manifest generator: type alias resolution, skip filter fixes
- [x] 4.2 -- Component audit: 100% manifest coverage
- [x] 4.3 -- Demo: Forma -- luxury ecommerce (`commerce` theme, 4 pages, 47 components)
- [x] 4.4 -- Demo: Wavefront -- music player (`midnight` theme, sidebar + player bar, 3 views)
- [x] 4.5 -- Demo: Mosaic -- visual discovery app (`light` theme, masonry grid, 3 pages)
- [x] 4.6 -- Demo: Atelier -- editorial magazine (`editorial` theme, zero-radius, real prose, 3 pages)
- [x] 4.7 -- Demo: Control -- component analytics dashboard (`dark` theme, 4 pages, full registry)
- [x] 4.8 -- Deploy all demos to Vercel
  - dashboard.arcana-ui.com
  - wavefront.arcana-ui.com
  - ecommerce.arcana-ui.com
  - atelier.arcana-ui.com
  - mosaic.arcana-ui.com
  - control.arcana-ui.com

---

## Phase P: Playground Product

- [x] P.1 -- Landing page (live at arcana-ui.com)
- [x] P.2 -- ComponentGallery with stats bar, richer cards, audit table mode
- [x] P.3 -- Visual token editor (custom HSV color picker, cubic bezier editor, undo/redo, search/filter, modified indicators)
- [x] P.4 -- Live component preview with category filter
- [x] **P.5 -- AI theme generation flow** (Sprint 2 shipped via PRs #108, #109, #110, #112, #113)
  - [x] Hero input wired to edge function with loading state
  - [x] `api/generate-theme.ts` at repo root
  - [x] Three theme variants per request, returned as structured JSON
  - [x] `/generate` route with side-by-side preview cards
  - [x] User picks one, lands in editor with theme applied via sessionStorage
  - [x] Cost controls: Haiku default, prompt caching, max_tokens 2500
  - [x] BYOK via `X-User-API-Key` header (plumbing + UI both live, #108)
  - [x] Topbar generated-theme name chip with close button (#109)
  - [x] Anthropic `error.type` forwarding, 16-case unit suite (#113)
- [x] **P.5.1 -- Cache backend swap from Vercel KV to Supabase** (PR #114, merged 2026-04-15). Same TTL, same key scheme, BYOK skip preserved.
- [x] **P.5.0 hotfix -- v0.1.1** (PRs #120 + #121, merged 2026-04-17). Fixed empty CSS module class-name maps in the published bundle. P0: every component was rendering unstyled in consumer apps before this.
- [ ] P.5.2 -- Supabase accounts + workspaces (save cocacola-light, cocacola-dark, switch between). **Deferred to post-launch.**
- [ ] P.5.3 -- Asset-augmented generation (logo + inspo upload, vision-conditioned). **Deferred to post-launch.**
- [ ] P.6 -- Theme gallery (browse presets, one-click load, fork). **Deferred to post-launch.**
- [ ] P.7 -- Authentication (GitHub + Google OAuth). **Deferred.**
- [ ] P.8 -- Theme save/load. **Deferred.**
- [x] P.9 -- Export (JSON and CSS already work)
- [ ] P.10 -- Monetization infrastructure. **Deferred.**
- [ ] P.11 -- AI generation rate limiting beyond current IP limit. **Deferred.**
- [ ] P.12 -- Accessibility panel (live WCAG scoring). **Deferred.**
- [x] **P.13 -- Per-preset motion personalities** (PRs #115, #116, #117, all merged 2026-04-15). Landing now consumes motion tokens, scroll-reveal + count-up + gradient-border primitives shipped, and 14 presets ship distinct motion personalities. Manifest captures motion personality so AI agents can query "which presets have calm motion" and get an answer.
- [ ] **P.14 -- Claude Design integration pack** (NEW, see `COMPETITIVE_INTEL_2026-05-07.md`). `@arcana-ui/claude-design-pack` of 14 DESIGN.md files plus a landing page at `arcana-ui.com/claude-design`. Targets the `claude.ai/design/#org → Add assets` flow.

---

## Phase 5: AI Integration & Launch

- [x] 5.1 -- manifest.ai.json (108 components, 100% coverage)
- [x] 5.2 -- llms.txt + llms-full.txt (2,370 lines)
- [x] 5.3 -- Claude Code skill at `.claude/skills/arcana/SKILL.md` (1,821 lines)
- [x] 5.4 -- MCP server: `@arcana-ui/mcp@0.1.0` (7 tools)
- [ ] **5.5 -- Documentation site -- SCAFFOLDED, content in progress.** `docs/` workspace exists with fumadocs-mdx, Next.js 15, React 19. Content generation from manifest.ai.json not yet wired.
- [ ] 5.6 -- SEO and discoverability (structured data, OG images, meta tags)
- [ ] 5.7 -- Community starter templates (Next, Vite, Remix, Astro). Tracked under Phase 7.
- [ ] 5.8 -- Figma Code Connect (light pass scoped, see `COMPETITIVE_INTEL_2026-05-07.md` insertion 3)
- [x] **5.9 -- Performance audit / tree-shaking fix.** Per-component entry points landed via `perf/5.9-per-component-entry-points`. `tsup.config.ts` now discovers ~82 entries programmatically (every primitive, composite, pattern, component, hook, layout module, context, and util). Each entry is self-contained with its own `"use client"` banner; `splitting: false` is preserved deliberately so the directive lands on every consumer-reachable output. `package.json` `exports` map exposes friendly subpaths (`@arcana-ui/core/Button`, `@arcana-ui/core/useTheme`, etc). `sideEffects` widened to `["**/*.css", "**/*.module.css"]` to keep CSS imports preserved during tree-shaking. **Verified consumer bundle: single-Button import 278 kB → 2.2 kB minified (99.2% drop); full barrel import 278 kB → 166.9 kB.** Bumped `@arcana-ui/core` to 0.1.2 (Bear publishes).
- [ ] 5.10 -- Launch checklist
- [x] 5.11 -- CLI: init, validate, add-theme
- [ ] **5.12 -- DESIGN.md export** (NEW, urgent post-Google-Labs spec release on 2026-04-21). Validates against `@google/design.md` CLI in CI. Each of 14 presets ships as a DESIGN.md file. PR'd to VoltAgent's `awesome-claude-design` list.

---

## Phase 6: Extensibility & Developer Experience

- [ ] 6.1 -- Icon system: default icon library recommendation, opt-out to none, BYOI support
- [ ] 6.2 -- Extension guidelines: EXTENDING.md file for AI agents
- [ ] 6.3 -- CLI enhancements: `add-theme` from description, `update` commands, AI-powered CLI flows
- [ ] 6.4 -- Component variant depth: variant-level tokens (e.g., button primary vs ghost at the token layer)
- [ ] 6.5 -- DESIGN.md export. **Promoted to Phase 5 task 5.12 above; row retained until next cleanup pass.**

---

## Phase 7: External Validation

- [ ] 7.1 -- `arcana-starter-saas` repo (Next.js dashboard, under Arcana-UI org)
- [ ] 7.2 -- `arcana-starter-storefront` repo (Vite + React ecommerce/marketing)
- [ ] 7.3 -- Website clone rebuilds: 3-5 real sites rebuilt with Arcana
- [ ] 7.4 -- DX friction tracking: every external-repo pain point as an issue on main repo

---

## Phase O: arcana-ops -- PARKED 2026-04-15

Status unchanged. Repo exists, dormant. Supabase project repurposed as the general Arcana project; `theme_cache` (PR #114) and any future P.5.2 accounts table land here. Revive when playground has real traffic and we actually need error / usage / cost visibility.

---

## Phase 8: GTM & Distribution

- [ ] 8.1 -- README overhaul with competitive positioning
- [ ] 8.2 -- Claude marketplace / skills listing
- [ ] 8.3 -- Show HN preparation and launch
- [ ] 8.4 -- Contributor guide and community templates
- [ ] 8.5 -- Per-component entry points performance audit (covered by 5.9)

---

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Tree-shaking broken (single entry point, 278 kB for any import) | RESOLVED | Fixed in 0.1.2 via per-component entry points + per-subpath exports map. Single-Button consumer bundle: 2.2 kB. |
| 20 `hono` advisories (15 moderate, 5 high) via `@modelcontextprotocol/sdk` in `packages/mcp` | Medium | Transitive. Not exploitable in current `@arcana-ui/mcp` usage (no user-controlled JSX). `pnpm.overrides` attempt on 2026-05-07 failed to propagate under pnpm v10.31.0; reverted. Fix: bump MCP SDK when upstream ships a patched-hono release. |
| 156 biome warnings reported, ~78 of which are duplicates from `.claude/worktrees/` | Low | Real warning count inside the working tree is ~78, roughly stable vs the 77 baseline. Categorized in KNOWN_ISSUES.md. Sweep planned before launch. |

Resolved since 2026-04-15: 16 useTheme tests now pass. Vercel KV deprecation cleared (PR #114). v0.1.1 CSS-module class-name map hotfix shipped (PRs #120/#121). `develop` synced with `main` (this PR). Tree-shaking remains the only outstanding launch blocker.

---

## Deployed Sites

| Site | URL | Status |
|------|-----|--------|
| Playground / Landing | arcana-ui.com | Live (307 → www.arcana-ui.com) |
| Playground (staging) | develop.arcana-ui.com | Live |
| Dashboard demo | dashboard.arcana-ui.com | Live |
| Wavefront demo | wavefront.arcana-ui.com | Live |
| Ecommerce demo | ecommerce.arcana-ui.com | Live |
| Atelier demo | atelier.arcana-ui.com | Live |
| Mosaic demo | mosaic.arcana-ui.com | Live |
| Control demo | control.arcana-ui.com | Live |
| Documentation site | docs.arcana-ui.com | Scaffold deployed; content TBD |

---

## Recent Sprint Summary (2026-04-15 to 2026-04-17)

Four PR clusters shipped in three days, then Bear stepped away. Captured here so the timeline is clear:

- **PR #114** (2026-04-15): KV→Supabase cache swap. Vercel KV deprecation cleared.
- **PRs #115, #116, #117** (2026-04-15): Three-PR landing polish + motion personalities. P.13 closed.
- **useTheme test fix** (2026-04-15 or earlier in the same window): all 16 tests pass.
- **PRs #120, #121** (2026-04-17): v0.1.1 hotfix for empty CSS module class-name maps. P0 in published bundle. Only `@arcana-ui/core` republished; `release.yml` was modified mid-flight to add `continue-on-error: true` on tokens / core publish steps. That change has been reverted in this cleanup PR; failed publishes should stay loud.

The 982-test suite passes. Build is green across tokens, core, cli, mcp, playground, 5 demos, and docs.
