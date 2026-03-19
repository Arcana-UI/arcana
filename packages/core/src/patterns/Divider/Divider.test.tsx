import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders hr element by default', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders with aria-orientation for vertical', () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.querySelector('hr')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders label text', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLHRElement>();
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });

  it('passes className', () => {
    const { container } = render(<Divider className="custom" />);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
