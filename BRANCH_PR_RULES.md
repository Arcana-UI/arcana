# Branch & PR Rules for AI Agents

> Add this to CLAUDE.md — these rules are non-negotiable.

---

## Branch Rules (STRICT — no exceptions)

### Creating Branches

EVERY new task gets a NEW branch. Never reuse a branch from a previous task.

```bash
# ALWAYS start from a clean, updated develop
git checkout develop && git pull origin develop

# ALWAYS create a new branch with this EXACT format:
git checkout -b {type}/{task-id}-{descriptive-name}
```

**The branch name must be descriptive enough that someone reading ONLY the branch name understands what it contains.**

```
# ❌ BAD branch names — vague, not descriptive
feat/updates
fix/bugs
feat/playground
refactor/improvements
feat/phase-3

# ✅ GOOD branch names — specific, descriptive
feat/3.4-datatable-statcard-progressbar-kpicard
fix/playground-token-editor-color-picker-lag
feat/P1-landing-page-hero-features-pricing
refactor/token-editor-collapsible-sections-search
feat/theme-switcher-json-upload-modal
fix/navbar-hamburger-not-opening-on-mobile
docs/releasing-strategy-changelog-setup
chore/npm-beta-publish-preparation
```

**Rules:**
1. Type must be one of: feat, fix, refactor, test, docs, chore
2. Task ID from the roadmap if applicable (3.4, P.1, 1.12, etc.)
3. Descriptive name uses kebab-case and lists the key deliverables
4. Maximum 60 characters total for the branch name
5. NEVER reuse a branch. Every `git checkout -b` is a new branch name.

### When Given a New Prompt Mid-Session

If the user gives you a new task while you're on an existing branch:

1. Commit and push your current work
2. Create a PR for the current branch (if it has meaningful changes)
3. Switch to develop: `git checkout develop && git pull`
4. Create a NEW branch for the new task
5. NEVER continue a different task on someone else's branch

---

## PR Rules (STRICT — no exceptions)

### PR Title Format

```
{type}({scope}): {specific description} [{task-id}]
```

The title must describe WHAT was done, not just reference a task number.

```
# ❌ BAD PR titles
feat: updates
fix: bug fixes
feat(core): phase 3 work
refactor: improvements

# ✅ GOOD PR titles
feat(core): add DataTable, StatCard, ProgressBar, KPICard [3.4]
fix(playground): fix color picker lag and token editor slider snapping
feat(playground): add landing page with hero, features, pricing sections [P.1]
feat(tokens): redesign all 6 presets with per-preset elevation strategies [4.1]
fix(core): fix Navbar hamburger menu not opening on mobile
refactor(tokens): add cubic bezier editor and motion duration controls
docs: add releasing strategy and changelog
chore: set up npm beta publish and branching infrastructure
```

### PR Description

The repository has a PR template at `.github/pull_request_template.md`. 
When creating a PR with `gh pr create`, you MUST fill in EVERY section of the template.

**CRITICAL: Do NOT leave template sections empty or with placeholder text.**
**CRITICAL: The "Changes Made" section must list EVERY file you touched.**
**CRITICAL: The "Breaking Changes" section must be filled in — write "None" if there are none.**
**CRITICAL: The CHANGELOG.md must be updated BEFORE creating the PR.**

```bash
# When using gh pr create, read the template first:
cat .github/pull_request_template.md

# Then create the PR with a FULLY filled-in body:
gh pr create \
  --title "feat(core): add DataTable, StatCard, ProgressBar, KPICard [3.4]" \
  --body "## Summary
Add four data display components for dashboard and analytics views.

## Task Reference
- Task: 3.4
- Phase: Phase 3
- ROADMAP.md Section: Section 4.2 (Data Display)

## Changes Made

### Added
- packages/core/src/components/DataTable/DataTable.tsx
- packages/core/src/components/DataTable/DataTable.css
- packages/core/src/components/DataTable/DataTable.test.tsx
- packages/core/src/components/DataTable/index.ts
- packages/core/src/components/StatCard/StatCard.tsx
- (... list EVERY file)

### Modified
- packages/core/src/index.ts (added exports)
- manifest.ai.json (added component entries)
- docs/COMPONENT-TOKENS.md (added token docs)
- PROGRESS.md (checked off 3.4)
- CHANGELOG.md (added entries under Unreleased)

### Removed
- None

## Breaking Changes
None

## How to Test
1. pnpm build
2. Open playground
3. Navigate to Data Display section
4. Verify DataTable sorting by clicking column headers
5. Verify StatCard trend indicators show correct colors
6. Switch themes - all components should adapt

## Checklist
- [x] pnpm lint passes
- [x] pnpm test passes
- [x] pnpm build passes
..."
```

---

## Changelog Rules

### CHANGELOG.md must be updated in EVERY PR

Before creating a PR, add entries to CHANGELOG.md under the `[Unreleased]` section.

Format (Keep a Changelog standard):
```markdown
## [Unreleased]

### Added
- DataTable component with sorting, filtering, pagination, and row selection
- StatCard component with trend indicators and compact variant
- ProgressBar component with striped, animated, and indeterminate modes
- KPICard component with inline SVG sparkline

### Changed
- Updated manifest.ai.json with data display component entries

### Fixed
- Fixed color picker not updating preview in real-time

### Breaking
- Renamed Button prop `type` to `variant` (migration: replace type= with variant=)
```

Categories:
- **Added** — new features, components, tokens
- **Changed** — modifications to existing behavior
- **Fixed** — bug fixes
- **Deprecated** — features that will be removed in a future version
- **Removed** — features that were removed
- **Breaking** — changes that require consumer code updates (MUST include migration instructions)

**Rules:**
1. Every `feat` commit = an "Added" entry
2. Every `fix` commit = a "Fixed" entry
3. Every breaking change = a "Breaking" entry WITH migration instructions
4. Entries should be specific: "Added DataTable component with sorting and pagination" not "Added new components"
5. The Unreleased section accumulates until a release, then gets moved under a version header

---

## Machine-Readable Release Metadata

For AI agents consuming Arcana, we also maintain version metadata in manifest.ai.json:

```json
{
  "version": "0.1.0-beta.1",
  "releaseDate": "2026-03-25",
  "changelog": "https://github.com/arcana-ui/arcana-ui/blob/main/CHANGELOG.md",
  "breaking": [],
  "migration": null
}
```

When there ARE breaking changes:
```json
{
  "version": "0.2.0",
  "releaseDate": "2026-05-01",
  "changelog": "https://github.com/arcana-ui/arcana-ui/blob/main/CHANGELOG.md",
  "breaking": [
    {
      "component": "Button",
      "change": "Prop 'type' renamed to 'variant'",
      "migration": "Replace type=\"primary\" with variant=\"primary\" in all Button usages"
    }
  ],
  "migration": "https://github.com/arcana-ui/arcana-ui/blob/main/docs/MIGRATION-0.2.0.md"
}
```

This means an AI agent can check manifest.ai.json, see if there are breaking changes, and automatically apply the migration instructions. Single parse, single result.
