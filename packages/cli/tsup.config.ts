import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  sourcemap: false,
  minify: false,
  dts: false,
  shims: false,
  splitting: false,
  // Keep deps external. Bundling commander (a CJS package) into ESM
  // breaks its internal `require('events')` calls because esbuild's
  // dynamic-require shim is not allowed in ESM mode. `npx` will install
  // the runtime deps from package.json before invoking the binary.
  external: ['@clack/prompts', 'picocolors', 'commander', 'js-yaml'],
  // The design-md converter is internal-only; bundle it into the CLI so
  // consumers get the export-design-md command without an extra install.
  noExternal: ['@arcana-ui/design-md'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  async onSuccess() {
    // Ship the 14 preset JSONs alongside the CLI so `arcana-ui
    // export-design-md` works without requiring @arcana-ui/tokens to be
    // installed in the consumer's project. Copied at build time from the
    // tokens package source rather than imported, because the tokens
    // package only ships compiled CSS in its npm tarball.
    const tokensSrc = path.resolve(process.cwd(), '..', 'tokens', 'src', 'presets');
    const cliDest = path.resolve(process.cwd(), 'dist', 'presets');
    mkdirSync(cliDest, { recursive: true });
    for (const file of readdirSync(tokensSrc)) {
      if (file.endsWith('.json')) {
        copyFileSync(path.join(tokensSrc, file), path.join(cliDest, file));
      }
    }
  },
});
