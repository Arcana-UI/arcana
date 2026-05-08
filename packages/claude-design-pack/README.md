# @arcana-ui/claude-design-pack

14 token-driven design systems shipped as `DESIGN.md` files, ready for Claude Design's "Add assets" flow. Drop any of them into `claude.ai/design/#org` and watch the design system land in 60 seconds.

## What's in the pack

Every Arcana preset (`light`, `dark`, `terminal`, `retro98`, `glass`, `brutalist`, `corporate`, `startup`, `editorial`, `commerce`, `midnight`, `nature`, `neon`, `mono`) is included as a Google DESIGN.md spec-compliant file under `presets/`. The pack also ships a `manifest.claude-design.json` that maps each preset to its slug, swatches, motion personality, raw GitHub URL, and codebase pointer.

All 14 files validate against `@google/design.md lint` on every CI run.

## Drop-in usage

1. Open [claude.ai/design](https://claude.ai/design).
2. Click your org -> **Add assets**.
3. Either upload one of the `presets/*.md` files, or point Claude Design at this repo: `https://github.com/Arcana-UI/arcana`.

Claude Design will read the DESIGN.md, extract the colors / typography / spacing / components, and apply that system to every project the org creates from then on.

## Programmatic usage

```ts
import manifest from '@arcana-ui/claude-design-pack';

console.log(manifest.presets.length); // 14
console.log(manifest.presets[0]);
// {
//   slug: 'brutalist',
//   name: 'Brutalist',
//   description: '...',
//   motionPersonality: 'static',
//   swatches: { background: '...', surface: '...', accent: '...' },
//   designMdUrl: 'https://raw.githubusercontent.com/...',
//   codebaseUrl: 'https://github.com/Arcana-UI/arcana',
// }
```

The DESIGN.md files themselves are accessible at `@arcana-ui/claude-design-pack/presets/<slug>.md`.

## Live preview

Every preset has an interactive demo at [arcana-ui.com/claude-design](https://arcana-ui.com/claude-design): swatches, motion personality badge, copy-the-DESIGN.md, and a download link.

## Source of truth

The `presets/*.md` files are regenerated on every push from `packages/tokens/src/presets/*.json` via `pnpm --filter @arcana-ui/claude-design-pack regenerate`. CI runs the same script in `--check` mode and fails the build if any preset has drifted from the source. So this directory is always source-derived.

## License

MIT. Free to fork, extend, and submit as your own design system. Submitting the Arcana presets to [VoltAgent's `awesome-claude-design`](https://github.com/VoltAgent/awesome-claude-design) is encouraged.
