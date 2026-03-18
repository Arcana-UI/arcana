import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Timeline } from './Timeline';

const items = [
  {
    title: 'Founded',
    description: 'Company was established.',
    date: 'Jan 2024',
    status: 'complete' as const,
  },
  {
    title: 'Series A',
    description: 'Raised $10M in funding.',
    date: 'Jun 2025',
    status: 'active' as const,
  },
  { title: 'IPO', description: 'Going public.', date: 'Q4 2026', status: 'pending' as const },
];

describe('Timeline', () => {
  // --- Smoke
  it('renders as nav element', () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector('nav')).toBeTruthy();
  });

  it('uses ordered list', () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector('ol')).toBeTruthy();
  });

  // --- Ref
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Timeline ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<Timeline items={items} className="custom" />);
    expect(container.querySelector('nav')?.classList.contains('custom')).toBe(true);
  });

  // --- Items
  it('renders all timeline items', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Founded')).toBeInTheDocument();
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('IPO')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Company was established.')).toBeInTheDocument();
  });

  it('renders dates', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
  });

  // --- Status dots
  it('renders complete dot with checkmark', () => {
    const { container } = render(<Timeline items={items} />);
    const completeDots = container.querySelectorAll('[class*="dotComplete"]');
    expect(completeDots.length).toBeGreaterThanOrEqual(1);
    expect(completeDots[0]?.textContent).toContain('\u2713');
  });

  it('renders active dot with pulse class', () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector('[class*="dotActive"]')).toBeTruthy();
  });

  it('renders pending dot', () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector('[class*="dotPending"]')).toBeTruthy();
  });

  // --- Custom icon
  it('renders custom icon instead of default', () => {
    const customItems = [
      { title: 'Custom', description: 'Has icon', icon: <svg data-testid="custom-icon" /> },
    ];
    render(<Timeline items={customItems} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // --- Variants
  it('applies standard variant by default', () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector('[class*="standard"]')).toBeTruthy();
  });

  it('applies compact variant', () => {
    const { container } = render(<Timeline items={items} variant="compact" />);
    expect(container.querySelector('[class*="compact"]')).toBeTruthy();
  });

  it('applies alternating variant', () => {
    const { container } = render(<Timeline items={items} variant="alternating" />);
    expect(container.querySelector('[class*="alternating"]')).toBeTruthy();
  });

  // --- Line visibility
  it('renders connecting lines between items (n-1 lines for n items)', () => {
    const { container } = render(<Timeline items={items} />);
    // Each item except the last has a connecting line
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
    // Last item should not have a line (only 2 lines for 3 items)
  });

  // --- Children
  it('renders children', () => {
    render(
      <Timeline items={items}>
        <span data-testid="extra">Extra</span>
      </Timeline>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(<Timeline items={items} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
