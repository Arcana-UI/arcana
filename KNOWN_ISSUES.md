# Known Issues

> Issues known to the maintainers at the time of each beta. Tracked here so
> consumer-facing expectations stay honest. Each entry lists impact, who is
> affected, and the planned resolution.

---

## `@arcana-ui/core@0.1.0-beta.2`

### 1. Tree-shaking does not eliminate unused components

**Impact:** A consumer bundle that imports only `<Button>` ships the same
~278 kB minified / ~82 kB gzipped JavaScript payload as a bundle that
imports 8 components. The full component graph is inlined regardless of
what is used.

**Who is affected:** Any consumer using a tree-shaking bundler (Vite,
Rollup, webpack, esbuild, Parcel). Gzipped size is still reasonable for
design systems (compare Chakra, MUI), but the headroom to pay for only
what you use is not there yet.

**Root cause:** `packages/core` is built with tsup in single-entry mode
(`splitting: false`) because enabling code splitting with a single entry
causes Rollup to strip the top-level `"use client"` directive that
Next.js App Router consumers rely on. With one flat bundle, consumer
bundlers treat the module as an all-or-nothing side-effect unit even
though `sideEffects: ["*.css"]` is set correctly.

**Workaround:** None at the consumer side. If you need a smaller bundle
right now, only import `@arcana-ui/core/styles` selectively and skip the
components you don't use — the JS savings are small but the CSS savings
are real.

**Planned fix:** Per-component entry points in `tsup.config.ts` so the
published package has one ESM file per component, each with its own
`"use client"` directive. Targeted for `0.1.0-beta.3`. Tracked as a
follow-up to the beta.2 audit PR.

---

### 2. `Video` component is missing

**Impact:** The public roadmap lists a `Video` component under Media;
it is not yet implemented, not exported, and not on npm. Importing it
from `@arcana-ui/core` will throw a runtime error and fail TypeScript.

**Who is affected:** Anyone following the roadmap who expects Media
parity with `Image`, `Avatar`, `Carousel`.

**Planned fix:** Scheduled alongside the component gallery expansion
in Phase 5. Use a native `<video>` element for now — Arcana's tokens
(radius, shadow, spacing) work fine on it.

---

### 3. `docs/*` and `examples/quickstart/` Vite config warnings on older Node

**Impact:** Vite 6 requires Node 18.17+ (Node 20 LTS recommended). On
Node 18.0–18.16, `@arcana-ui/example-quickstart` scripts will warn or
fail to resolve modules.

**Who is affected:** Contributors running the example on outdated Node.

**Workaround:** `nvm use 20` or upgrade to Node 18.17+.

---

## `@arcana-ui/tokens@0.1.0-beta.2`

### 1. Unreferenced primitive warnings during build

**Impact:** `pnpm build` inside `packages/tokens` emits ~20 warnings of
the form `⚠ Unreferenced primitive: primitive.zIndex.modal`. These are
not errors — the tokens exist in the JSON source but no semantic token
currently maps to them. The emitted CSS is correct.

**Planned fix:** Either wire these primitives into a semantic layer or
delete the unused entries. Tracked as a token hygiene pass in Sprint 2.

---

## General

### 1. `useTheme` test suite jsdom environment

**Impact:** 16 tests in `packages/core/src/hooks/useTheme.test.tsx`
fail with `localStorage.clear is not a function`. These failures are
isolated to the test environment; the hook itself works in real
browsers.

**Status:** RESOLVED as of 2026-04-15. All 16 tests pass under the
current vitest + jsdom setup. Entry retained for historical context.

---

### 2. Transitive `hono` advisories via `@modelcontextprotocol/sdk`

**Impact:** `pnpm audit` reports 20 advisories (15 moderate, 5 high)
all rooted at `hono` 4.12.12, pulled in transitively through
`@modelcontextprotocol/sdk@1.29.0` from `packages/mcp`. Latest hono is
4.12.18; the patched versions are >= 4.12.16 (per
GHSA-9vqf-7f2p-gf9v and GHSA-69xw-7hcm-h432, both about HTML injection
in `hono/jsx` via unvalidated tag names).

**Who is affected:** Any consumer running `pnpm audit` against a
project that depends on `@arcana-ui/mcp`. Surfaces as a warning in the
audit log.

**Exploitability:** Not exploitable in current `@arcana-ui/mcp` usage.
The MCP server does not render user-controlled JSX; the advisory
covers a code path Arcana doesn't exercise.

**Attempted fix (2026-05-07):** Added a `pnpm.overrides` entry for
`hono: ^4.12.16` to the root `package.json`. pnpm v10.31.0 did not
propagate the override to the lockfile even after `pnpm install
--force` (24-minute full reinstall confirmed no effect). Tried
`pnpm update @modelcontextprotocol/sdk --recursive` first, also no
effect on the resolved hono version. Override reverted, advisories
left in place.

**Planned fix:** Wait for the next `@modelcontextprotocol/sdk` release
that bundles a patched hono, then bump in `packages/mcp/package.json`.
Track upstream at `github.com/modelcontextprotocol/typescript-sdk`.

---

### 3. Biome lint warning total looks high but is artifact of worktree

**Impact:** `pnpm lint` reports 156 warnings against a 77-warning
baseline that held through April. Investigation shows 78 of the 156
warnings come from `.claude/worktrees/` directories (Claude Code
worktrees biome scans as duplicate code). Real warning count inside
the repo working tree has not grown.

**Categorization (real 78 warnings, excluding worktree double-count):**

- a11y: ~57 warnings, mostly `useSemanticElements` (24 in core,
  patterns like Modal/Toast/Spinner where role attributes flag the
  warning), `noSvgWithoutTitle` (11), `useKeyWithClickEvents` (9).
- suspicious: ~14 warnings, mostly `noArrayIndexKey` (12 across demos
  and patterns) and `noEmptyBlock` (2).
- style: ~6 warnings, `noNonNullAssertion` and `noParameterAssign` in
  test fixtures and contrast utility.
- correctness: ~7 warnings, `useExhaustiveDependencies` in playground
  pages (TokenImpact, TokenExplorer).

**Workaround:** Lint from a clean checkout outside the worktree to see
the real count, or add `.claude/worktrees/**` to `biome.json` ignore
list (intentionally not done in this PR per scope).

**Planned fix:** Sweep the a11y warnings as a maintenance pass before
launch. Most are recommended rules biome promoted that were grandfathered
in when the codebase grew. Not blocking.
