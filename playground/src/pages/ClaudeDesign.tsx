import { Badge, Button, CopyButton } from '@arcana-ui/core';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import manifest from '../../../packages/claude-design-pack/manifest.claude-design.json';
import styles from './ClaudeDesign.module.css';

const presetMarkdown = import.meta.glob('../../../packages/claude-design-pack/presets/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function mdFor(slug: string): string {
  const entry = Object.entries(presetMarkdown).find(([path]) => path.endsWith(`/${slug}.md`));
  return entry?.[1] ?? '';
}

function downloadMd(slug: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const PERSONALITY_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'info' | 'secondary'
> = {
  default: 'secondary',
  calm: 'info',
  snappy: 'success',
  static: 'default',
  spring: 'warning',
  step: 'default',
  organic: 'success',
  languid: 'info',
};

export default function ClaudeDesign() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Arcana for Claude Design - 14 design systems, one drop';
    const prevTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'midnight');
    return () => {
      document.title = prevTitle;
      if (prevTheme) document.documentElement.setAttribute('data-theme', prevTheme);
      else document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Primary">
          <Link to="/" className={styles.brand}>
            Arcana UI
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://github.com/Arcana-UI/arcana', '_blank')}
          >
            GitHub
          </Button>
        </nav>

        <header className={styles.hero}>
          <span className={styles.eyebrow}>Claude Design pack</span>
          <h1 className={styles.title}>Arcana for Claude Design.</h1>
          <p className={styles.subtitle}>
            14 design systems. One drop. Built so AI agents understand what each token is for.
          </p>
          <p className={styles.lead}>
            Claude Design lets your org install a design system once and have every project that
            Claude builds inherit it. Each Arcana preset ships as a Google DESIGN.md spec file with
            colors, typography, spacing, motion, and components annotated for machine consumption.
            Pick one, paste the markdown into Claude Design, and every future asset stays on brand.
          </p>
          <div className={styles.cardActions}>
            <Button
              variant="primary"
              size="md"
              onClick={() => window.open('https://claude.ai/design', '_blank')}
            >
              Open Claude Design
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() =>
                window.open(
                  'https://github.com/Arcana-UI/arcana/tree/main/packages/claude-design-pack',
                  '_blank',
                )
              }
            >
              View on GitHub
            </Button>
          </div>
        </header>

        <section className={styles.gridSection} aria-labelledby="presets-heading">
          <div className={styles.sectionHead}>
            <h2 id="presets-heading" className={styles.sectionTitle}>
              14 ready presets
            </h2>
            <span className={styles.sectionMeta}>
              All validated against <code className={styles.code}>@google/design.md lint</code> on
              every CI run.
            </span>
          </div>

          <div className={styles.grid}>
            {manifest.presets.map((p) => {
              const md = mdFor(p.slug);
              const variant = PERSONALITY_VARIANT[p.motionPersonality] ?? 'default';
              return (
                <article key={p.slug} className={styles.card}>
                  <div className={styles.cardHead}>
                    <h3 className={styles.cardName}>{p.name}</h3>
                    <Badge variant={variant} size="sm">
                      {p.motionPersonality}
                    </Badge>
                  </div>
                  <div
                    className={styles.swatches}
                    aria-label={`Color swatches for ${p.name}: background, surface, accent`}
                  >
                    <span
                      className={styles.swatch}
                      style={{ background: p.swatches.background }}
                      title={`background ${p.swatches.background}`}
                    />
                    <span
                      className={styles.swatch}
                      style={{ background: p.swatches.surface }}
                      title={`surface ${p.swatches.surface}`}
                    />
                    <span
                      className={styles.swatch}
                      style={{ background: p.swatches.accent }}
                      title={`accent ${p.swatches.accent}`}
                    />
                  </div>
                  <p className={styles.cardDesc}>{p.description}</p>
                  <div className={styles.cardActions}>
                    <CopyButton
                      value={md}
                      label="Copy DESIGN.md"
                      copiedLabel="Copied"
                      size="sm"
                      variant="default"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadMd(p.slug, md)}
                      aria-label={`Download ${p.name} DESIGN.md`}
                    >
                      Download .md
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.gridSection} aria-labelledby="howto-heading">
          <div className={styles.sectionHead}>
            <h2 id="howto-heading" className={styles.sectionTitle}>
              How to import
            </h2>
            <span className={styles.sectionMeta}>60 seconds, no build step.</span>
          </div>
          <ol className={styles.steps}>
            <li className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <h3 className={styles.stepHead}>Pick a preset</h3>
              <p className={styles.stepBody}>
                Copy the DESIGN.md of any card above, or download the file. Each one is a complete,
                self-contained design system.
              </p>
            </li>
            <li className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <h3 className={styles.stepHead}>Open Claude Design</h3>
              <p className={styles.stepBody}>
                Go to <code className={styles.code}>claude.ai/design</code>, select your org, and
                click <strong>Add assets</strong>.
              </p>
            </li>
            <li className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <h3 className={styles.stepHead}>Paste and ship</h3>
              <p className={styles.stepBody}>
                Drop in the markdown (or point Claude Design at this repo). Every project the org
                creates will inherit the system from then on.
              </p>
            </li>
          </ol>
        </section>

        <footer className={styles.footer}>
          <span>
            Source:{' '}
            <a
              href="https://github.com/Arcana-UI/arcana/tree/main/packages/claude-design-pack"
              target="_blank"
              rel="noreferrer"
            >
              @arcana-ui/claude-design-pack
            </a>
          </span>
          <span>
            <a
              href="https://github.com/VoltAgent/awesome-claude-design"
              target="_blank"
              rel="noreferrer"
            >
              Submit your preset to awesome-claude-design
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
