import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  // --- Smoke test ---
  it('renders without errors', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  // --- Variant rendering ---
  it('renders all variants without crashing', () => {
    const variants = ['primary', 'secondary', 'ghost', 'destructive', 'outline'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
      unmount();
    }
  });

  // --- Size rendering ---
  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
      unmount();
    }
  });

  // --- Ref forwarding ---
  it('forwards ref to the underlying button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain('Ref test');
  });

  // --- className passthrough ---
  it('passes through className to the button element', () => {
    render(<Button className="custom-class">Styled</Button>);
    expect(screen.getByRole('button', { name: 'Styled' })).toHaveClass('custom-class');
  });

  // --- Event handlers ---
  it('fires onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // --- Keyboard interaction ---
  it('can be focused via Tab', async () => {
    const user = userEvent.setup();
    render(<Button>Focus me</Button>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
  });

  it('activates with Enter key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enter test</Button>);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('activates with Space key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Space test</Button>);
    await user.tab();
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // --- Disabled state ---
  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Disabled' });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('cannot be focused when disabled', async () => {
    const user = userEvent.setup();
    render(<Button disabled>Disabled</Button>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Disabled' })).not.toHaveFocus();
  });

  // --- Loading state ---
  it('sets aria-busy and disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    const btn = screen.getByRole('button', { name: 'Submit' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  // --- fullWidth prop ---
  it('renders fullWidth prop without crashing', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button', { name: 'Full Width' })).toBeInTheDocument();
  });

  // --- Icon props ---
  it('renders icon and iconRight props', () => {
    render(
      <Button
        icon={<span data-testid="left-icon">L</span>}
        iconRight={<span data-testid="right-icon">R</span>}
      >
        Icons
      </Button>,
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('hides icons when loading', () => {
    render(
      <Button loading icon={<span data-testid="left-icon">L</span>}>
        Loading
      </Button>,
    );
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
  });

  // --- ARIA attributes ---
  it('does not set aria-busy when not loading', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button', { name: 'Normal' })).not.toHaveAttribute('aria-busy');
  });

  // --- Accessibility ---
  it('passes axe accessibility checks', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks when loading', async () => {
    const { container } = render(<Button loading>Loading Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
