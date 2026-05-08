import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { type Options, defineConfig } from 'tsup';

// CSS Modules plugin — fix for issue #119.
//
// tsup 8.x registers an internal `onLoad({ filter: /\.css$/ })` handler
// (postcssPlugin in tsup/dist/index.js). Its filter is not namespace-scoped,
// so it intercepts every `.css`-suffixed load call in every namespace and
// forwards it through `loader: "css"` — which gives an ES module with no
// default export, producing the `var Component_default = {};` that every
// component bundled with in 0.1.0.
//
// Because tsup registers that plugin before user-supplied `esbuildPlugins`,
// we cannot simply beat it to onLoad. Instead we:
//   1. onResolve `.module.css` imports and rewrite the path to end in
//      `?arcana-css-module` — a suffix tsup's `/\.css$/` filter cannot
//      match — then tag it with our own `arcana-css-modules` namespace.
//   2. onLoad in that namespace reads the real file, hashes every class
//      selector to `<File>_<name>_<hash>`, and emits a JS module that
//      side-effect-imports a sibling virtual sheet and default-exports
//      the original-to-hashed name map.
//   3. onResolve the sibling sheet and tag it with
//      `arcana-css-module-sheet`. The sheet path ends in
//      `?arcana-css-module-sheet` so tsup's filter still can't steal it.
//   4. onLoad the sheet with `loader: "css"` — esbuild then bundles the
//      rewritten CSS into dist/index.css alongside the plain stylesheets.
//
// Every `<ComponentName>_<className>_<hash>` selector in dist/index.css
// now has a corresponding entry in the default export of the JS module
// that the component file imported as `styles`.
// biome-ignore lint/suspicious/noExplicitAny: esbuild's plugin build object is typed by esbuild itself
const cssModulesPlugin: any = {
  name: 'arcana-css-modules',
  // biome-ignore lint/suspicious/noExplicitAny: see above
  setup(build: any) {
    const MODULE_SUFFIX = '?arcana-css-module';
    const SHEET_SUFFIX = '?arcana-css-module-sheet';
    const sheetContents = new Map<string, string>();

    build.onResolve(
      { filter: /\.module\.css$/ },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      (args: any) => {
        const absolute = path.isAbsolute(args.path)
          ? args.path
          : path.resolve(args.resolveDir, args.path);
        return {
          path: absolute + MODULE_SUFFIX,
          namespace: 'arcana-css-modules',
        };
      },
    );

    build.onLoad(
      { filter: /\?arcana-css-module$/, namespace: 'arcana-css-modules' },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      async (args: any) => {
        const realPath = args.path.slice(0, -MODULE_SUFFIX.length);
        const source = await fs.promises.readFile(realPath, 'utf8');

        const classNames = new Set<string>();
        source.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (match, name: string) => {
          classNames.add(name);
          return match;
        });

        const relative = path.relative(process.cwd(), realPath);
        const hash = crypto.createHash('sha256').update(relative).digest('hex').slice(0, 5);
        const base = path.basename(realPath, '.module.css');

        const mapping: Record<string, string> = {};
        let rewritten = source;
        for (const name of classNames) {
          const scoped = `${base}_${name}_${hash}`;
          mapping[name] = scoped;
          const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          rewritten = rewritten.replace(new RegExp(`\\.${escaped}(?![\\w-])`, 'g'), `.${scoped}`);
        }

        const sheetPath = realPath + SHEET_SUFFIX;
        sheetContents.set(sheetPath, rewritten);

        return {
          contents: `import ${JSON.stringify(sheetPath)};\nexport default ${JSON.stringify(mapping)};\n`,
          loader: 'js',
          resolveDir: path.dirname(realPath),
        };
      },
    );

    build.onResolve(
      { filter: /\?arcana-css-module-sheet$/ },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      (args: any) => ({
        path: args.path,
        namespace: 'arcana-css-module-sheet',
      }),
    );

    build.onLoad(
      { filter: /.*/, namespace: 'arcana-css-module-sheet' },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      (args: any) => {
        const css = sheetContents.get(args.path) ?? '';
        const origin = args.path.slice(0, -SHEET_SUFFIX.length);
        return {
          contents: css,
          loader: 'css',
          resolveDir: path.dirname(origin),
        };
      },
    );
  },
};

// Tree-shaking strategy (5.9): we ship one entry per component, hook,
// and utility under `dist/` so consumers can deep-import a single
// component (`@arcana-ui/core/Button`) and pay only for that
// component's code plus its actual dependencies, instead of inlining
// the whole library.
//
// We keep splitting=false intentionally: the "use client" banner that
// esbuild writes via the banner option must end up at the top of every
// consumer-reachable output, and tsup's splitting strips that banner
// from shared chunks. With splitting=false each entry is self-
// contained, so the directive lands on every output file and Next.js
// App Router / Server Components see it correctly.
//
// Side effect: shared utility code (`cn`, `useFloating`, etc.) gets
// duplicated across entries on disk. That cost is paid once at
// install time; consumer bundlers dedupe the modules they actually
// import.
function discoverEntries(): Record<string, string> {
  const srcDir = path.resolve(process.cwd(), 'src');
  const entries: Record<string, string> = {
    index: 'src/index.ts',
  };

  for (const category of ['primitives', 'composites', 'patterns', 'components']) {
    const catDir = path.join(srcDir, category);
    if (!fs.existsSync(catDir)) continue;
    for (const name of fs.readdirSync(catDir)) {
      const entryPath = path.join(catDir, name, 'index.ts');
      if (fs.existsSync(entryPath)) {
        entries[`${category}/${name}/index`] = `src/${category}/${name}/index.ts`;
      }
    }
  }

  const layoutEntry = path.join(srcDir, 'layout', 'index.ts');
  if (fs.existsSync(layoutEntry)) {
    entries['layout/index'] = 'src/layout/index.ts';
  }

  const hooksDir = path.join(srcDir, 'hooks');
  if (fs.existsSync(hooksDir)) {
    for (const file of fs.readdirSync(hooksDir)) {
      if ((file.endsWith('.ts') || file.endsWith('.tsx')) && !file.includes('.test.')) {
        const name = file.replace(/\.tsx?$/, '');
        entries[`hooks/${name}`] = `src/hooks/${file}`;
      }
    }
  }

  entries['context/ThemeProvider'] = 'src/context/ThemeProvider.tsx';
  entries['utils/cn'] = 'src/utils/cn.ts';
  entries.version = 'src/version.ts';

  return entries;
}

// Copy manifest.ai.json from the repo root into dist/ so consumers and AI
// agents can read it at `@arcana-ui/core/dist/manifest.ai.json` without
// having to clone the full repo. Only a best-effort copy — if the root
// manifest is missing (fresh checkout, CI order), the build still succeeds.
async function copyManifest(): Promise<void> {
  // tsup runs with cwd = packages/core, so resolve the monorepo root relative to it.
  const src = path.resolve(process.cwd(), '../../manifest.ai.json');
  const dest = path.resolve(process.cwd(), 'dist/manifest.ai.json');
  try {
    await fs.promises.copyFile(src, dest);
  } catch (err) {
    console.warn(`[tsup] could not copy manifest.ai.json to dist: ${(err as Error).message}`);
  }
}

const config: Options = {
  entry: discoverEntries(),
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  esbuildPlugins: [cssModulesPlugin],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  async onSuccess() {
    await copyManifest();
  },
};

export default defineConfig(config);
