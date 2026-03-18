import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PricingCard } from './PricingCard';

const defaultProps = {
  name: 'Pro',
  price: 29,
  period: '/month',
  description: 'For growing teams',
  features: [
    { label: 'Unlimited projects', included: true },
    { label: 'Priority support', included: true },
    { label: 'Custom domain', included: false },
  ],
  cta: { label: 'Get Started', href: '/signup' },
};

describe('PricingCard', () => {
  // --- Smoke test
  it('renders plan name', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeInTheDocument();
  });

  it('renders as article with aria-label', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByRole('article', { name: 'Pro pricing plan' })).toBeInTheDocument();
  });

  // --- Ref forwarding
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<PricingCard ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<PricingCard {...defaultProps} className="custom" />);
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  // --- Price display
  it('displays numeric price with dollar sign', () => {
    render(<PricingCard {...defaultProps} price={29} />);
    expect(screen.getByText('$29')).toBeInTheDocument();
  });

  it('displays string price as-is', () => {
    render(<PricingCard {...defaultProps} price="Free" />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('displays period', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  // --- Description
  it('renders description', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('For growing teams')).toBeInTheDocument();
  });

  // --- Features
  it('renders feature list', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument();
    expect(screen.getByText('Priority support')).toBeInTheDocument();
    expect(screen.getByText('Custom domain')).toBeInTheDocument();
  });

  it('renders included features with checkmark', () => {
    const { container } = render(<PricingCard {...defaultProps} />);
    const features = container.querySelectorAll('li');
    expect(features[0]?.textContent).toContain('\u2713');
  });

  it('renders excluded features with X mark and line-through', () => {
    const { container } = render(<PricingCard {...defaultProps} />);
    const excluded = container.querySelector('[class*="featureExcluded"]');
    expect(excluded).toBeTruthy();
    expect(excluded?.textContent).toContain('\u2715');
  });

  // --- CTA
  it('renders CTA as link when href provided', () => {
    render(<PricingCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: 'Get Started' });
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('renders CTA as button when onClick provided', () => {
    const onClick = vi.fn();
    render(<PricingCard {...defaultProps} cta={{ label: 'Subscribe', onClick }} />);
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('fires onClick on CTA click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PricingCard {...defaultProps} cta={{ label: 'Subscribe', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // --- Popular
  it('renders popular badge', () => {
    render(<PricingCard {...defaultProps} popular />);
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('applies popular styling class', () => {
    const { container } = render(<PricingCard {...defaultProps} popular />);
    expect(container.querySelector('[class*="popular"]')).toBeTruthy();
  });

  it('popular badge has aria-label', () => {
    render(<PricingCard {...defaultProps} popular />);
    expect(screen.getByLabelText('Most popular plan')).toBeInTheDocument();
  });

  // --- Compact variant
  it('applies compact variant class', () => {
    const { container } = render(<PricingCard {...defaultProps} variant="compact" />);
    expect(container.querySelector('[class*="compact"]')).toBeTruthy();
  });

  // --- Children
  it('renders children', () => {
    render(
      <PricingCard {...defaultProps}>
        <div data-testid="extra">Extra content</div>
      </PricingCard>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(<PricingCard {...defaultProps} popular />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
