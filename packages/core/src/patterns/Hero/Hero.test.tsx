import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  // --- Smoke test
  it('renders as section with headline', () => {
    render(<Hero headline="Welcome to Nimbus" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Welcome to Nimbus' }),
    ).toBeInTheDocument();
  });

  it('renders as a section element', () => {
    const { container } = render(<Hero headline="Test" />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  // --- Ref forwarding
  it('forwards ref to the section element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Hero ref={ref} headline="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('SECTION');
  });

  // --- className passthrough
  it('accepts className', () => {
    const { container } = render(<Hero headline="Test" className="custom" />);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  // --- Subheadline
  it('renders subheadline when provided', () => {
    render(<Hero headline="Title" subheadline="A great product for everyone" />);
    expect(screen.getByText('A great product for everyone')).toBeInTheDocument();
  });

  it('does not render subheadline when not provided', () => {
    const { container } = render(<Hero headline="Title" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  // --- Badge
  it('renders badge when provided', () => {
    render(<Hero headline="Title" badge="Now in beta" />);
    expect(screen.getByText('Now in beta')).toBeInTheDocument();
  });

  it('does not render badge when not provided', () => {
    const { container } = render(<Hero headline="Title" />);
    expect(container.querySelector('[class*="badge"]')).toBeNull();
  });

  // --- Primary CTA
  it('renders primary CTA as link when href is provided', () => {
    render(<Hero headline="Title" primaryCTA={{ label: 'Get Started', href: '/signup' }} />);
    const link = screen.getByRole('link', { name: 'Get Started' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('renders primary CTA as button when onClick is provided', () => {
    const onClick = vi.fn();
    render(<Hero headline="Title" primaryCTA={{ label: 'Get Started', onClick }} />);
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('fires onClick on primary CTA click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Hero headline="Title" primaryCTA={{ label: 'Start', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // --- Secondary CTA
  it('renders secondary CTA', () => {
    render(
      <Hero
        headline="Title"
        primaryCTA={{ label: 'Start', href: '/' }}
        secondaryCTA={{ label: 'Learn more', href: '/about' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
  });

  it('does not render actions container when no CTAs provided', () => {
    const { container } = render(<Hero headline="Title" />);
    expect(container.querySelector('[class*="actions"]')).toBeNull();
  });

  // --- Media
  it('renders media content', () => {
    render(<Hero headline="Title" media={<img src="/hero.png" alt="Hero visual" />} />);
    expect(screen.getByAltText('Hero visual')).toBeInTheDocument();
  });

  // --- Variants
  it('applies centered variant by default', () => {
    const { container } = render(<Hero headline="Test" />);
    expect(container.querySelector('[class*="centered"]')).toBeTruthy();
  });

  it('applies split variant', () => {
    const { container } = render(<Hero headline="Test" variant="split" />);
    expect(container.querySelector('[class*="split"]')).toBeTruthy();
  });

  it('applies fullscreen variant', () => {
    const { container } = render(<Hero headline="Test" variant="fullscreen" />);
    expect(container.querySelector('[class*="fullscreen"]')).toBeTruthy();
  });

  // --- Height
  it('applies viewport height', () => {
    const { container } = render(<Hero headline="Test" height="viewport" />);
    expect(container.querySelector('[class*="heightViewport"]')).toBeTruthy();
  });

  it('applies large height', () => {
    const { container } = render(<Hero headline="Test" height="large" />);
    expect(container.querySelector('[class*="heightLarge"]')).toBeTruthy();
  });

  // --- Align
  it('applies left alignment', () => {
    const { container } = render(<Hero headline="Test" align="left" />);
    expect(container.querySelector('[class*="alignLeft"]')).toBeTruthy();
  });

  // --- Overlay
  it('renders overlay background when overlay is true on fullscreen', () => {
    const { container } = render(<Hero headline="Test" variant="fullscreen" overlay />);
    expect(container.querySelector('[class*="overlayBg"]')).toBeTruthy();
  });

  it('applies overlay class', () => {
    const { container } = render(<Hero headline="Test" overlay />);
    expect(container.querySelector('[class*="overlay"]')).toBeTruthy();
  });

  // --- Children
  it('renders children content', () => {
    render(
      <Hero headline="Title">
        <div data-testid="custom">Custom content</div>
      </Hero>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  // --- aria-labelledby
  it('has aria-labelledby pointing to headline', () => {
    const { container } = render(<Hero headline="Test" />);
    const section = container.querySelector('section');
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(section?.getAttribute('aria-labelledby')).toBe(h1.id);
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Hero
        headline="Welcome"
        subheadline="Build amazing things"
        primaryCTA={{ label: 'Get Started', href: '/start' }}
        badge="New"
      />,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
