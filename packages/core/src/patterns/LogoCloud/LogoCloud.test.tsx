import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { LogoCloud } from './LogoCloud';

const logos = [
  { src: '/logos/acme.svg', alt: 'Acme Corp' },
  { src: '/logos/globex.svg', alt: 'Globex', href: 'https://globex.example.com' },
  { src: '/logos/initech.svg', alt: 'Initech' },
  { src: '/logos/umbrella.svg', alt: 'Umbrella Corp' },
];

describe('LogoCloud', () => {
  // --- Smoke
  it('renders as section element', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  // --- Ref
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<LogoCloud ref={ref} logos={logos} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<LogoCloud logos={logos} className="custom" />);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  // --- Title
  it('renders title when provided', () => {
    render(<LogoCloud logos={logos} title="Trusted by" />);
    expect(screen.getByRole('heading', { name: 'Trusted by' })).toBeInTheDocument();
  });

  it('does not render title when absent', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('h2')).toBeNull();
  });

  // --- Logos
  it('renders all logo images with alt text', () => {
    render(<LogoCloud logos={logos} />);
    expect(screen.getByAltText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByAltText('Globex')).toBeInTheDocument();
    expect(screen.getByAltText('Initech')).toBeInTheDocument();
  });

  it('renders linked logos as anchor elements', () => {
    render(<LogoCloud logos={logos} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://globex.example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders non-linked logos as divs', () => {
    const { container } = render(<LogoCloud logos={[{ src: '/test.svg', alt: 'Test' }]} />);
    expect(container.querySelector('a')).toBeNull();
  });

  // --- Variants
  it('applies grid variant by default', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('[class*="grid"]')).toBeTruthy();
  });

  it('applies marquee variant', () => {
    const { container } = render(<LogoCloud logos={logos} variant="marquee" />);
    expect(container.querySelector('[class*="marquee"]')).toBeTruthy();
  });

  it('applies fade variant', () => {
    const { container } = render(<LogoCloud logos={logos} variant="fade" />);
    expect(container.querySelector('[class*="fade"]')).toBeTruthy();
  });

  // --- Grayscale class
  it('applies grayscale filter to logo images', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    const imgs = container.querySelectorAll('img');
    for (const img of imgs) {
      expect(img.className).toContain('logoImage');
    }
  });

  // --- Lazy loading
  it('uses lazy loading on images', () => {
    render(<LogoCloud logos={logos} />);
    const img = screen.getByAltText('Acme Corp');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  // --- Children
  it('renders children', () => {
    render(
      <LogoCloud logos={logos}>
        <span data-testid="extra">Extra</span>
      </LogoCloud>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(<LogoCloud logos={logos} title="Trusted by" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
