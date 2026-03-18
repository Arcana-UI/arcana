import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CTA } from './CTA';

const defaultProps = {
  headline: 'Ready to get started?',
  description: 'Join thousands of teams building better products.',
  primaryCTA: { label: 'Sign Up Free', href: '/signup' },
};

describe('CTA', () => {
  // --- Smoke
  it('renders as section element', () => {
    const { container } = render(<CTA {...defaultProps} />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('renders headline as h2', () => {
    render(<CTA {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Ready to get started?' }),
    ).toBeInTheDocument();
  });

  // --- Ref
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<CTA ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<CTA {...defaultProps} className="custom" />);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  // --- Description
  it('renders description', () => {
    render(<CTA {...defaultProps} />);
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('does not render description when absent', () => {
    const { container } = render(<CTA headline="Title" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  // --- Primary CTA
  it('renders primary CTA as link', () => {
    render(<CTA {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Sign Up Free' });
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('renders primary CTA as button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CTA headline="Title" primaryCTA={{ label: 'Start', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // --- Secondary CTA
  it('renders secondary CTA', () => {
    render(<CTA {...defaultProps} secondaryCTA={{ label: 'Learn More', href: '/about' }} />);
    expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
  });

  // --- Variants
  it('applies banner variant by default', () => {
    const { container } = render(<CTA {...defaultProps} />);
    expect(container.querySelector('[class*="banner"]')).toBeTruthy();
  });

  it('applies card variant', () => {
    const { container } = render(<CTA {...defaultProps} variant="card" />);
    expect(container.querySelector('[class*="card"]')).toBeTruthy();
  });

  it('applies minimal variant', () => {
    const { container } = render(<CTA {...defaultProps} variant="minimal" />);
    expect(container.querySelector('[class*="minimal"]')).toBeTruthy();
  });

  // --- aria-label
  it('has aria-label matching headline', () => {
    const { container } = render(<CTA {...defaultProps} />);
    expect(container.querySelector('section')?.getAttribute('aria-label')).toBe(
      defaultProps.headline,
    );
  });

  // --- Children
  it('renders children', () => {
    render(
      <CTA {...defaultProps}>
        <span data-testid="extra">Extra</span>
      </CTA>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(
      <CTA {...defaultProps} secondaryCTA={{ label: 'Learn More', href: '/about' }} />,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
