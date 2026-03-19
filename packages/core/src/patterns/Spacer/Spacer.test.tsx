import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Spacer } from './Spacer';

describe('Spacer', () => {
  it('renders a div', () => {
    const { container } = render(<Spacer />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has aria-hidden', () => {
    const { container } = render(<Spacer />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Spacer ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<Spacer className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
