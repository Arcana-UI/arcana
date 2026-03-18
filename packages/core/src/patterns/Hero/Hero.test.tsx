import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Hero,
  HeroActions,
  HeroBadge,
  HeroContent,
  HeroDescription,
  HeroMedia,
  HeroTitle,
} from './Hero';

describe('Hero', () => {
  it('renders as section element', () => {
    const { container } = render(<Hero>Content</Hero>);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Hero ref={ref}>Content</Hero>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<Hero className="custom">Content</Hero>);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('renders centered variant by default', () => {
    const { container } = render(<Hero>Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('centered');
  });

  it('renders split variant', () => {
    const { container } = render(<Hero variant="split">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('split');
  });

  it('renders fullscreen variant', () => {
    const { container } = render(<Hero variant="fullscreen">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('fullscreen');
  });

  it('renders viewport height', () => {
    const { container } = render(<Hero height="viewport">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('heightViewport');
  });

  it('renders large height', () => {
    const { container } = render(<Hero height="large">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('heightLarge');
  });

  it('renders left-aligned', () => {
    const { container } = render(<Hero align="left">Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('alignLeft');
  });

  it('renders overlay with aria-hidden backdrop', () => {
    const { container } = render(<Hero overlay>Content</Hero>);
    const section = container.querySelector('section');
    expect(section?.className).toContain('overlay');
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders HeroBadge', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroBadge>Now in beta</HeroBadge>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByText('Now in beta')).toBeTruthy();
  });

  it('renders HeroTitle as h1 by default', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroTitle>Welcome</HeroTitle>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome' })).toBeTruthy();
  });

  it('renders HeroTitle as custom heading level', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroTitle as="h2">Welcome</HeroTitle>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Welcome' })).toBeTruthy();
  });

  it('renders HeroDescription', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroDescription>A great product</HeroDescription>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByText('A great product')).toBeTruthy();
  });

  it('renders HeroActions with buttons', () => {
    render(
      <Hero>
        <HeroContent>
          <HeroActions data-testid="actions">
            <button type="button">Get Started</button>
            <button type="button">Learn More</button>
          </HeroActions>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByTestId('actions')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeTruthy();
  });

  it('renders HeroMedia', () => {
    render(
      <Hero variant="split">
        <HeroMedia data-testid="media">
          <img src="/hero.png" alt="Hero" />
        </HeroMedia>
      </Hero>,
    );
    expect(screen.getByTestId('media')).toBeTruthy();
    expect(screen.getByAltText('Hero')).toBeTruthy();
  });

  it('HeroContent forwards ref', () => {
    const ref = vi.fn();
    render(
      <Hero>
        <HeroContent ref={ref}>Content</HeroContent>
      </Hero>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('HeroBadge forwards ref', () => {
    const ref = vi.fn();
    render(
      <Hero>
        <HeroBadge ref={ref}>Beta</HeroBadge>
      </Hero>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('composes full hero with all sub-components', () => {
    render(
      <Hero variant="centered" height="large" overlay>
        <HeroContent>
          <HeroBadge>New</HeroBadge>
          <HeroTitle>Build faster</HeroTitle>
          <HeroDescription>Ship in minutes</HeroDescription>
          <HeroActions>
            <button type="button">Start</button>
          </HeroActions>
        </HeroContent>
      </Hero>,
    );
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Build faster' })).toBeTruthy();
    expect(screen.getByText('Ship in minutes')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy();
  });
});
