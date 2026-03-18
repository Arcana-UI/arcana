import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeatureItem, FeatureSection } from './FeatureSection';

describe('FeatureSection', () => {
  it('renders as section element', () => {
    const { container } = render(
      <FeatureSection>
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <FeatureSection ref={ref}>
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(
      <FeatureSection className="custom">
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('renders section title with aria-labelledby', () => {
    const { container } = render(
      <FeatureSection title="Our Features">
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    const section = container.querySelector('section');
    const heading = screen.getByRole('heading', { level: 2, name: 'Our Features' });
    expect(heading).toBeTruthy();
    expect(section?.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('renders section subtitle', () => {
    render(
      <FeatureSection title="Features" subtitle="Everything you need">
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getByText('Everything you need')).toBeTruthy();
  });

  it('renders grid variant by default', () => {
    const { container } = render(
      <FeatureSection>
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('[class*="grid"]')).toBeTruthy();
  });

  it('renders list variant', () => {
    const { container } = render(
      <FeatureSection variant="list">
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('[class*="list"]')).toBeTruthy();
  });

  it('renders alternating variant', () => {
    const { container } = render(
      <FeatureSection variant="alternating">
        <FeatureItem title="Fast">Content</FeatureItem>
      </FeatureSection>,
    );
    expect(container.querySelector('[class*="alternating"]')).toBeTruthy();
  });

  it('renders FeatureItem with title', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Lightning Fast">Speed</FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Lightning Fast' })).toBeTruthy();
  });

  it('renders FeatureItem with description', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Fast" description="Built for speed" />
      </FeatureSection>,
    );
    expect(screen.getByText('Built for speed')).toBeTruthy();
  });

  it('renders FeatureItem icon with aria-hidden', () => {
    const { container } = render(
      <FeatureSection>
        <FeatureItem title="Fast" icon={<svg data-testid="icon" />}>
          Content
        </FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders FeatureItem with link', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Fast" link={{ label: 'Learn more', href: '/features/speed' }} />
      </FeatureSection>,
    );
    const link = screen.getByRole('link', { name: /Learn more/ });
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/features/speed');
  });

  it('renders multiple items', () => {
    render(
      <FeatureSection>
        <FeatureItem title="Fast">Speed</FeatureItem>
        <FeatureItem title="Secure">Safety</FeatureItem>
        <FeatureItem title="Simple">Easy</FeatureItem>
      </FeatureSection>,
    );
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('FeatureItem forwards ref', () => {
    const ref = vi.fn();
    render(
      <FeatureSection>
        <FeatureItem ref={ref} title="Fast">
          Content
        </FeatureItem>
      </FeatureSection>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
