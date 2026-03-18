import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Testimonial } from './Testimonial';

const defaultProps = {
  quote: 'This product completely transformed our workflow.',
  author: 'Jane Doe',
  jobTitle: 'CEO',
  company: 'Acme Corp',
};

describe('Testimonial', () => {
  // --- Smoke
  it('renders as figure element', () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    expect(container.querySelector('figure')).toBeTruthy();
  });

  it('renders quote in blockquote', () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    expect(container.querySelector('blockquote')).toBeTruthy();
    expect(screen.getByText(defaultProps.quote)).toBeInTheDocument();
  });

  // --- Ref
  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Testimonial ref={ref} {...defaultProps} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  // --- className
  it('accepts className', () => {
    const { container } = render(<Testimonial {...defaultProps} className="custom" />);
    expect(container.querySelector('figure')?.classList.contains('custom')).toBe(true);
  });

  // --- Author
  it('renders author name in cite element', () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    const cite = container.querySelector('cite');
    expect(cite?.textContent).toBe('Jane Doe');
  });

  it('renders role and company', () => {
    render(<Testimonial {...defaultProps} />);
    expect(screen.getByText('CEO, Acme Corp')).toBeInTheDocument();
  });

  it('renders only jobTitle when company is absent', () => {
    render(<Testimonial {...defaultProps} company={undefined} />);
    expect(screen.getByText('CEO')).toBeInTheDocument();
  });

  // --- Avatar
  it('renders avatar image', () => {
    const { container } = render(<Testimonial {...defaultProps} avatar="/avatar.png" />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/avatar.png');
  });

  it('does not render avatar when not provided', () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    expect(container.querySelector('img')).toBeNull();
  });

  // --- Variants
  it('applies card variant by default', () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    expect(container.querySelector('[class*="card"]')).toBeTruthy();
  });

  it('applies inline variant', () => {
    const { container } = render(<Testimonial {...defaultProps} variant="inline" />);
    expect(container.querySelector('[class*="inline"]')).toBeTruthy();
  });

  it('applies featured variant', () => {
    const { container } = render(<Testimonial {...defaultProps} variant="featured" />);
    expect(container.querySelector('[class*="featured"]')).toBeTruthy();
  });

  // --- Rating
  it('renders star rating', () => {
    render(<Testimonial {...defaultProps} rating={4} />);
    expect(screen.getByRole('img', { name: 'Rated 4 out of 5 stars' })).toBeInTheDocument();
  });

  it('renders 5 stars with correct filled count', () => {
    const { container } = render(<Testimonial {...defaultProps} rating={3} />);
    const filled = container.querySelectorAll('[class*="starFilled"]');
    expect(filled).toHaveLength(3);
  });

  it('does not render stars when rating is not provided', () => {
    const { container } = render(<Testimonial {...defaultProps} />);
    expect(container.querySelector('[class*="stars"]')).toBeNull();
  });

  // --- Children
  it('renders children', () => {
    render(
      <Testimonial {...defaultProps}>
        <span data-testid="extra">Extra</span>
      </Testimonial>,
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  // --- Accessibility
  it('has no accessibility violations', async () => {
    const { container } = render(<Testimonial {...defaultProps} avatar="/avatar.png" rating={5} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
