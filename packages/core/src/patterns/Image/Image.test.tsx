import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  it('renders an img element', () => {
    render(<Image src="test.jpg" alt="Test image" />);
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it('uses lazy loading by default', () => {
    render(<Image src="test.jpg" alt="Test" />);
    expect(screen.getByAltText('Test')).toHaveAttribute('loading', 'lazy');
  });

  it('disables lazy loading when lazy is false', () => {
    render(<Image src="test.jpg" alt="Test" lazy={false} />);
    expect(screen.getByAltText('Test')).not.toHaveAttribute('loading');
  });

  it('shows fallback content on error', () => {
    render(<Image src="broken.jpg" alt="Broken" fallback={<span>Error</span>} />);
    fireEvent.error(screen.getByAltText('Broken'));
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('shows loaded state after image loads', () => {
    const { container } = render(<Image src="test.jpg" alt="Test" />);
    fireEvent.load(screen.getByAltText('Test'));
    expect(container.querySelector('[class*="loaded"]')).toBeInTheDocument();
  });

  it('applies border radius', () => {
    const { container } = render(<Image src="test.jpg" alt="Test" radius="lg" />);
    expect(container.querySelector('[class*="radius-lg"]')).toBeInTheDocument();
  });

  it('applies aspect ratio', () => {
    const { container } = render(<Image src="test.jpg" alt="Test" aspectRatio="video" />);
    expect(container.firstElementChild).toHaveStyle({ aspectRatio: `${16 / 9}` });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLImageElement>();
    render(<Image ref={ref} src="test.jpg" alt="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it('requires alt prop for accessibility', () => {
    render(<Image src="test.jpg" alt="" />);
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
});
