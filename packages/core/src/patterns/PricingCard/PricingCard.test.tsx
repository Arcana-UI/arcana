import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  PricingCard,
  PricingCardAction,
  PricingCardFeature,
  PricingCardFeatures,
  PricingCardHeader,
  PricingCardPrice,
} from './PricingCard';

describe('PricingCard', () => {
  it('renders as div', () => {
    const { container } = render(<PricingCard>Content</PricingCard>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<PricingCard ref={ref}>Content</PricingCard>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<PricingCard className="custom">Content</PricingCard>);
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  it('renders popular variant with badge', () => {
    const { container } = render(<PricingCard popular>Content</PricingCard>);
    expect(container.firstElementChild?.className).toContain('popular');
    expect(screen.getByText('Most Popular')).toBeTruthy();
  });

  it('popular badge has aria-label', () => {
    render(<PricingCard popular>Content</PricingCard>);
    expect(screen.getByLabelText('Most popular plan')).toBeTruthy();
  });

  it('renders compact variant', () => {
    const { container } = render(<PricingCard variant="compact">Content</PricingCard>);
    expect(container.firstElementChild?.className).toContain('compact');
  });

  it('renders plan name in header', () => {
    render(
      <PricingCard>
        <PricingCardHeader plan="Pro" />
      </PricingCard>,
    );
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeTruthy();
  });

  it('renders plan description', () => {
    render(
      <PricingCard>
        <PricingCardHeader plan="Pro" description="For growing teams" />
      </PricingCard>,
    );
    expect(screen.getByText('For growing teams')).toBeTruthy();
  });

  it('renders price with period', () => {
    render(
      <PricingCard>
        <PricingCardPrice amount="$29" period="/month" />
      </PricingCard>,
    );
    expect(screen.getByText('$29')).toBeTruthy();
    expect(screen.getByText('/month')).toBeTruthy();
  });

  it('renders included features with check icon', () => {
    const { container } = render(
      <PricingCard>
        <PricingCardFeatures>
          <PricingCardFeature>10 users</PricingCardFeature>
        </PricingCardFeatures>
      </PricingCard>,
    );
    expect(screen.getByText('10 users')).toBeTruthy();
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon?.textContent).toBe('\u2713');
  });

  it('renders excluded features with cross icon', () => {
    const { container } = render(
      <PricingCard>
        <PricingCardFeatures>
          <PricingCardFeature included={false}>Priority support</PricingCardFeature>
        </PricingCardFeatures>
      </PricingCard>,
    );
    const li = container.querySelector('li');
    expect(li?.className).toContain('featureExcluded');
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon?.textContent).toBe('\u2717');
  });

  it('renders action slot with full-width button', () => {
    render(
      <PricingCard>
        <PricingCardAction>
          <button type="button">Subscribe</button>
        </PricingCardAction>
      </PricingCard>,
    );
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeTruthy();
  });

  it('features list has role="list"', () => {
    render(
      <PricingCard>
        <PricingCardFeatures>
          <PricingCardFeature>Feature</PricingCardFeature>
        </PricingCardFeatures>
      </PricingCard>,
    );
    expect(screen.getByRole('list')).toBeTruthy();
  });

  it('PricingCardHeader forwards ref', () => {
    const ref = vi.fn();
    render(
      <PricingCard>
        <PricingCardHeader ref={ref} plan="Pro" />
      </PricingCard>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('composes full pricing card', () => {
    render(
      <PricingCard popular>
        <PricingCardHeader plan="Pro" description="Best value" />
        <PricingCardPrice amount="$49" period="/month" />
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited users</PricingCardFeature>
          <PricingCardFeature>API access</PricingCardFeature>
          <PricingCardFeature included={false}>White label</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardAction>
          <button type="button">Get Started</button>
        </PricingCardAction>
      </PricingCard>,
    );
    expect(screen.getByText('Most Popular')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeTruthy();
    expect(screen.getByText('$49')).toBeTruthy();
    expect(screen.getByText('Unlimited users')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeTruthy();
  });
});
