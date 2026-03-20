import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

// ─── SVG Icons (inline to avoid dependencies) ─────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function TokensIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ComponentsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m15.5 5.5-2.8 2.8" />
      <path d="M18 8h-4" />
      <path d="m15.5 18.5-2.8-2.8" />
      <path d="M12 22v-4" />
      <path d="m8.5 18.5 2.8-2.8" />
      <path d="M6 8h4" />
      <path d="m8.5 5.5 2.8 2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg className={styles.navLogoMark} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="url(#logo-gradient)" />
      <path
        d="M8 19l6-11 6 11"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="14" cy="12" r="2" fill="white" opacity="0.6" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Theme Preview Data ────────────────────────────────────────────────────────

const THEME_PREVIEWS = [
  {
    id: 'light',
    name: 'Light',
    desc: 'Warm stone + indigo accent',
    bg: '#ffffff',
    surface: '#fafaf9',
    fg: '#1c1917',
    fgSecondary: '#78716c',
    accent: '#4f46e5',
    accentFg: '#ffffff',
    border: '#e7e5e4',
    inputBg: '#ffffff',
  },
  {
    id: 'dark',
    name: 'Dark',
    desc: 'Slate + vibrant indigo',
    bg: '#0f172a',
    surface: '#1e293b',
    fg: '#e2e8f0',
    fgSecondary: '#94a3b8',
    accent: '#818cf8',
    accentFg: '#0f172a',
    border: 'rgba(148,163,184,0.15)',
    inputBg: '#1e293b',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    desc: 'Phosphor green on black',
    bg: '#0a0a0a',
    surface: '#111111',
    fg: '#00ff41',
    fgSecondary: '#00cc33',
    accent: '#00ff41',
    accentFg: '#0a0a0a',
    border: 'rgba(0,255,65,0.15)',
    inputBg: '#111111',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    desc: 'Elegant serif typography',
    bg: '#faf8f5',
    surface: '#fafaf9',
    fg: '#1c1917',
    fgSecondary: '#57534e',
    accent: '#1c1917',
    accentFg: '#ffffff',
    border: '#d6d3d1',
    inputBg: '#ffffff',
  },
  {
    id: 'neon',
    name: 'Neon',
    desc: 'Cyan + pink cyberpunk',
    bg: '#08080c',
    surface: '#111118',
    fg: '#f0f0f8',
    fgSecondary: '#a0a0b8',
    accent: '#22d3ee',
    accentFg: '#08080c',
    border: 'rgba(160,160,184,0.15)',
    inputBg: '#111118',
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    desc: 'No mercy, no radius',
    bg: '#ffffff',
    surface: '#f5f5f5',
    fg: '#000000',
    fgSecondary: '#333333',
    accent: '#000000',
    accentFg: '#ffffff',
    border: '#000000',
    inputBg: '#ffffff',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Landing Page Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promptValue, setPromptValue] = useState('');

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/playground');
  };

  return (
    <div className={styles.landing}>
      {/* ═══ SECTION 1: Navbar ═══ */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.navLogo} aria-label="Arcana UI home">
            <LogoMark />
            <span className={styles.navLogoText}>Arcana</span>
          </Link>

          <ul className={styles.navLinks}>
            <li>
              <a href="https://arcana-design-system.vercel.app/docs" className={styles.navLink}>
                Docs
              </a>
            </li>
            <li>
              <Link to="/playground" className={styles.navLink}>
                Playground
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/garrettbear/arcana-ui"
                className={styles.navLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>

          <div className={styles.navActions}>
            <button type="button" className={styles.navBtnGhost}>
              Log In
            </button>
            <button type="button" className={styles.navBtnPrimary}>
              Sign Up
            </button>
          </div>

          <button
            type="button"
            className={styles.navMobileToggle}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        role="presentation"
      >
        <div
          className={styles.mobileMenuPanel}
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <button
            type="button"
            className={styles.mobileMenuClose}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
          <ul className={styles.mobileMenuLinks}>
            <li>
              <a
                href="https://arcana-design-system.vercel.app/docs"
                className={styles.mobileMenuLink}
              >
                Docs
              </a>
            </li>
            <li>
              <Link
                to="/playground"
                className={styles.mobileMenuLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Playground
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/garrettbear/arcana-ui"
                className={styles.mobileMenuLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <button
                type="button"
                className={styles.navBtnGhost}
                style={{ width: '100%', textAlign: 'left', padding: '12px 0' }}
              >
                Log In
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles.navBtnPrimary}
                style={{ width: '100%', marginTop: '8px' }}
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      </div>

      <main>
        {/* ═══ SECTION 2: Hero ═══ */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />

          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Open Source
          </div>

          <h1 className={styles.heroHeadline}>
            Describe your brand.{' '}
            <span className={styles.heroHeadlineAccent}>Get a design system.</span>
          </h1>

          <p className={styles.heroSubheadline}>
            Token-driven theming, 60+ React components, built for AI to assemble and humans to love.
          </p>

          <form onSubmit={handlePromptSubmit} className={styles.promptWrap}>
            <input
              type="text"
              className={styles.promptInput}
              placeholder="Tell me about your brand — colors, mood, industry..."
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              aria-label="Describe your brand"
            />
            <button
              type="submit"
              className={styles.promptSubmit}
              aria-label="Generate design system"
            >
              <ArrowIcon />
            </button>
          </form>

          <div className={styles.promptLinks}>
            or{' '}
            <Link to="/playground" className={styles.promptTextLink}>
              Browse themes
            </Link>
            {' · '}
            <Link to="/playground" className={styles.promptTextLink}>
              Start from scratch
            </Link>
          </div>
        </section>

        {/* ═══ SECTION 3: Logo Cloud ═══ */}
        <section className={styles.logoCloud}>
          <p className={styles.logoCloudLabel}>Built for AI tools</p>
          <div className={styles.logoCloudGrid}>
            {['Claude Code', 'Cursor', 'GitHub Copilot', 'v0', 'Bolt', 'Lovable'].map((name) => (
              <span key={name} className={styles.logoCloudItem}>
                <svg className={styles.logoCloudIcon} viewBox="0 0 20 20" fill="currentColor">
                  <rect x="2" y="2" width="16" height="16" rx="4" opacity="0.3" />
                  <rect x="5" y="5" width="10" height="10" rx="2" opacity="0.6" />
                </svg>
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 4: Features ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Arcana</h2>
          <p className={styles.sectionSubtitle}>
            A design system engineered for the AI era. Predictable for machines, beautiful for
            humans.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TokensIcon />
              </div>
              <h3 className={styles.featureTitle}>Token-Driven Theming</h3>
              <p className={styles.featureDesc}>
                One JSON file controls your entire design system. 120+ tokens across color,
                typography, spacing, elevation, motion, and more. Change the file, change
                everything.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ComponentsIcon />
              </div>
              <h3 className={styles.featureTitle}>60+ Production Components</h3>
              <p className={styles.featureDesc}>
                From Hero sections to DataTables. Dashboard, marketing, editorial, and e-commerce
                categories — all responsive, accessible, and theme-aware.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <AIIcon />
              </div>
              <h3 className={styles.featureTitle}>AI-First Architecture</h3>
              <p className={styles.featureDesc}>
                manifest.ai.json for discovery, semantic token naming, predictable component APIs.
                Built for machines to compose, gorgeous for humans to use.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 5: How It Works ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>
            From brand description to production UI in three steps.
          </p>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Describe</h3>
              <p className={styles.stepDesc}>
                Type your brand description. Arcana generates a complete theme — colors, typography,
                spacing, shadows — from a single sentence.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Customize</h3>
              <p className={styles.stepDesc}>
                Fine-tune with the visual editor. Adjust any of 120+ tokens, preview across 60+
                components in real time. Every change is instant.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Ship</h3>
              <p className={styles.stepDesc}>
                Export as JSON, CSS custom properties, or a full starter project. Works with any
                React app. Zero runtime cost.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 6: Theme Showcase ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>One system, infinite looks</h2>
          <p className={styles.sectionSubtitle}>
            Same components, completely different personalities. Each theme is a single JSON file.
          </p>

          <div className={styles.themeGrid}>
            {THEME_PREVIEWS.map((theme) => (
              <Link
                key={theme.id}
                to={`/playground?theme=${theme.id}`}
                className={styles.themeCard}
              >
                <div className={styles.themePreview} style={{ background: theme.bg }}>
                  <div
                    className={styles.themePreviewBtn}
                    style={{
                      background: theme.accent,
                      color: theme.accentFg,
                      borderRadius: theme.id === 'brutalist' ? '0' : undefined,
                    }}
                  >
                    Get Started
                  </div>
                  <input
                    className={styles.themePreviewInput}
                    style={{
                      background: theme.inputBg,
                      color: theme.fg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: theme.id === 'brutalist' ? '0' : undefined,
                    }}
                    value="jane@example.com"
                    readOnly
                    tabIndex={-1}
                  />
                  <div
                    className={styles.themePreviewCard}
                    style={{
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      color: theme.fgSecondary,
                      borderRadius: theme.id === 'brutalist' ? '0' : undefined,
                    }}
                  >
                    <span
                      style={{
                        color: theme.fg,
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      Dashboard
                    </span>
                    Revenue is up 12% this month with 3 new enterprise accounts.
                  </div>
                </div>
                <div className={styles.themeMeta}>
                  <p className={styles.themeName}>{theme.name}</p>
                  <p className={styles.themeDesc}>{theme.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 7: Component Showcase ═══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Production-ready components</h2>
          <p className={styles.sectionSubtitle}>
            Every component is responsive, accessible, and fully token-driven. Here's a taste of
            what ships out of the box.
          </p>

          <div className={styles.browserFrame}>
            <div className={styles.browserBar}>
              <div className={styles.browserDot} />
              <div className={styles.browserDot} />
              <div className={styles.browserDot} />
              <span className={styles.browserUrl}>your-app.com</span>
            </div>
            <div className={styles.browserContent}>
              {/* Light-themed inner showcase */}
              <div className={styles.showcaseInner} data-theme="light">
                <div
                  style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid #e7e5e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#1c1917',
                      fontSize: '16px',
                      fontFamily: 'var(--font-family-display, Inter, sans-serif)',
                    }}
                  >
                    Acme Inc
                  </span>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#78716c' }}>
                    <span>Dashboard</span>
                    <span>Products</span>
                    <span>Analytics</span>
                    <span>Settings</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        padding: '6px 14px',
                        background: '#4f46e5',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      New Project
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: '32px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                  }}
                >
                  {[
                    { label: 'Revenue', value: '$48,293', trend: '+12.5%', color: '#16a34a' },
                    { label: 'Users', value: '2,847', trend: '+8.2%', color: '#16a34a' },
                    { label: 'Conversion', value: '3.24%', trend: '-0.4%', color: '#dc2626' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: '20px',
                        border: '1px solid #e7e5e4',
                        borderRadius: '12px',
                        background: '#ffffff',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '8px' }}>
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: '#1c1917',
                          letterSpacing: '-0.02em',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: stat.color,
                          fontWeight: 500,
                          marginTop: '4px',
                        }}
                      >
                        {stat.trend} from last month
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0 32px 32px' }}>
                  <div
                    style={{
                      border: '1px solid #e7e5e4',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        padding: '12px 20px',
                        background: '#fafaf9',
                        borderBottom: '1px solid #e7e5e4',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#57534e',
                      }}
                    >
                      <span>Customer</span>
                      <span>Plan</span>
                      <span>MRR</span>
                      <span>Status</span>
                    </div>
                    {[
                      { name: 'Linear', plan: 'Enterprise', mrr: '$12,000', status: 'Active' },
                      { name: 'Vercel', plan: 'Business', mrr: '$4,800', status: 'Active' },
                      { name: 'Notion', plan: 'Enterprise', mrr: '$8,400', status: 'Active' },
                    ].map((row) => (
                      <div
                        key={row.name}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr',
                          padding: '14px 20px',
                          borderBottom: '1px solid #f5f5f4',
                          fontSize: '14px',
                          color: '#44403c',
                        }}
                      >
                        <span style={{ fontWeight: 500, color: '#1c1917' }}>{row.name}</span>
                        <span>{row.plan}</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{row.mrr}</span>
                        <span>
                          <span
                            style={{
                              background: '#dcfce7',
                              color: '#166534',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 500,
                            }}
                          >
                            {row.status}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 8: Stats ═══ */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {[
              { value: '60+', label: 'Components' },
              { value: '120+', label: 'Design Tokens', accent: true },
              { value: '14', label: 'Theme Presets' },
              { value: '5', label: 'Site Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`${styles.statValue} ${stat.accent ? styles.statValueAccent : ''}`}>
                  {stat.value}
                </p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 9: CTA ═══ */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaHeadline}>Start building with Arcana</h2>
          <p className={styles.ctaDesc}>
            Open the playground to explore themes, customize tokens, and preview every component in
            real time.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/playground" className={styles.ctaBtnPrimary}>
              Open Playground
            </Link>
            <a
              href="https://github.com/garrettbear/arcana-ui"
              className={styles.ctaBtnSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </main>

      {/* ═══ SECTION 10: Footer ═══ */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <span className={styles.footerBrandName}>Arcana UI</span>
            <p className={styles.footerBrandDesc}>
              The design system built for AI. Token-driven theming, production components, infinite
              possibilities.
            </p>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Product</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/playground" className={styles.footerLink}>
                  Playground
                </Link>
              </li>
              <li>
                <a
                  href="https://arcana-design-system.vercel.app/docs"
                  className={styles.footerLink}
                >
                  Docs
                </a>
              </li>
              <li>
                <Link to="/playground" className={styles.footerLink}>
                  Components
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li>
                <a
                  href="https://github.com/garrettbear/arcana-ui"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/org/arcana-ui"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/garrettbear/arcana-ui/blob/main/CLAUDE.md"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CLAUDE.md
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Company</h4>
            <ul className={styles.footerLinks}>
              <li>
                <span className={styles.footerLink}>About</span>
              </li>
              <li>
                <span className={styles.footerLink}>Blog</span>
              </li>
              <li>
                <a
                  href="https://github.com/garrettbear/arcana-ui/blob/main/LICENSE"
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>MIT License · Made with Arcana · &copy; 2026</span>
          <div className={styles.footerBottomLinks}>
            <a
              href="https://github.com/garrettbear/arcana-ui"
              className={styles.footerBottomLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
