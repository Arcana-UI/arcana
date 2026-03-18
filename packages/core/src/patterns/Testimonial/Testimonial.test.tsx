import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Testimonial, TestimonialAuthor, TestimonialQuote, TestimonialRating } from './Testimonial';

describe('Testimonial', () => {
  it('renders as figure element', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial ref={ref}>
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <Testimonial className="custom">
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')?.classList.contains('custom')).toBe(true);
  });

  it('renders card variant by default', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    const figure = container.querySelector('figure');
    expect(figure?.className).not.toContain('inline');
    expect(figure?.className).not.toContain('featured');
  });

  it('renders inline variant', () => {
    const { container } = render(
      <Testimonial variant="inline">
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')?.className).toContain('inline');
  });

  it('renders featured variant', () => {
    const { container } = render(
      <Testimonial variant="featured">
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('figure')?.className).toContain('featured');
  });

  it('renders quote in blockquote', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>This changed my workflow</TestimonialQuote>
      </Testimonial>,
    );
    expect(container.querySelector('blockquote')).toBeTruthy();
    expect(screen.getByText('This changed my workflow')).toBeTruthy();
  });

  it('renders author name in cite element', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
        <TestimonialAuthor name="Jane Doe" />
      </Testimonial>,
    );
    const cite = container.querySelector('cite');
    expect(cite?.textContent).toBe('Jane Doe');
  });

  it('renders author with title and company', () => {
    render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
        <TestimonialAuthor name="Jane Doe" title="CEO" company="Acme Inc" />
      </Testimonial>,
    );
    expect(screen.getByText('CEO, Acme Inc')).toBeTruthy();
  });

  it('renders author avatar', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialQuote>Great!</TestimonialQuote>
        <TestimonialAuthor name="Jane Doe" avatar="/avatar.png" />
      </Testimonial>,
    );
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/avatar.png');
  });

  it('renders rating with aria-label', () => {
    render(
      <Testimonial>
        <TestimonialRating value={4} />
        <TestimonialQuote>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(screen.getByLabelText('4 out of 5 stars')).toBeTruthy();
  });

  it('renders correct number of filled stars', () => {
    const { container } = render(
      <Testimonial>
        <TestimonialRating value={3} />
        <TestimonialQuote>Good!</TestimonialQuote>
      </Testimonial>,
    );
    const filled = container.querySelectorAll('[class*="starFilled"]');
    const empty = container.querySelectorAll('[class*="starEmpty"]');
    expect(filled).toHaveLength(3);
    expect(empty).toHaveLength(2);
  });

  it('clamps rating between 1 and 5', () => {
    render(
      <Testimonial>
        <TestimonialRating value={10} />
        <TestimonialQuote>Over the top!</TestimonialQuote>
      </Testimonial>,
    );
    expect(screen.getByLabelText('5 out of 5 stars')).toBeTruthy();
  });

  it('TestimonialQuote forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial>
        <TestimonialQuote ref={ref}>Great!</TestimonialQuote>
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('TestimonialAuthor forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial>
        <TestimonialAuthor ref={ref} name="Jane" />
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('TestimonialRating forwards ref', () => {
    const ref = vi.fn();
    render(
      <Testimonial>
        <TestimonialRating ref={ref} value={5} />
        <TestimonialQuote>Perfect!</TestimonialQuote>
      </Testimonial>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
