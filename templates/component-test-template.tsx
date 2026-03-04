/**
 * Component Test Template — Arcana UI
 *
 * Copy this file when creating tests for a new component.
 * Replace "ComponentName" with your component name throughout.
 * Remove or adapt sections that don't apply to your component.
 *
 * Every component test should cover these areas:
 * 1. Smoke test — renders without errors
 * 2. Variant rendering — each variant applies correct classes
 * 3. Ref forwarding — forwardRef works correctly
 * 4. className passthrough — custom classes are applied
 * 5. Event handlers — onClick, onChange, etc. fire correctly
 * 6. Keyboard interaction — Tab, Enter, Space, Escape work
 * 7. ARIA attributes — correct roles, labels, states
 * 8. Disabled state — prevents interaction
 * 9. Accessibility — passes axe-core checks
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
// import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // =========================================================================
  // 1. SMOKE TEST
  // Verifies the component renders without throwing errors.
  // =========================================================================
  it('renders without errors', () => {
    // render(<ComponentName>Label</ComponentName>);
    // expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
  });

  // =========================================================================
  // 2. VARIANT RENDERING
  // Verifies each visual variant renders correctly.
  // =========================================================================
  it('renders all variants without crashing', () => {
    // const variants = ['primary', 'secondary'] as const;
    // for (const variant of variants) {
    //   const { unmount } = render(
    //     <ComponentName variant={variant}>{variant}</ComponentName>,
    //   );
    //   expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
    //   unmount();
    // }
  });

  it('renders all sizes without crashing', () => {
    // const sizes = ['sm', 'md', 'lg'] as const;
    // for (const size of sizes) {
    //   const { unmount } = render(
    //     <ComponentName size={size}>{size}</ComponentName>,
    //   );
    //   expect(screen.getByRole('button', { name: size })).toBeInTheDocument();
    //   unmount();
    // }
  });

  // =========================================================================
  // 3. REF FORWARDING
  // Verifies forwardRef passes the ref to the underlying DOM element.
  // =========================================================================
  it('forwards ref to the underlying element', () => {
    // const ref = React.createRef<HTMLButtonElement>();
    // render(<ComponentName ref={ref}>Ref test</ComponentName>);
    // expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // =========================================================================
  // 4. CLASSNAME PASSTHROUGH
  // Verifies the className prop is applied to the root element.
  // =========================================================================
  it('passes through className', () => {
    // render(<ComponentName className="custom-class">Styled</ComponentName>);
    // expect(screen.getByRole('button', { name: 'Styled' })).toHaveClass('custom-class');
  });

  // =========================================================================
  // 5. EVENT HANDLERS
  // Verifies event callbacks fire with correct arguments.
  // Use userEvent over fireEvent for realistic browser behavior.
  // =========================================================================
  it('fires onClick handler when clicked', async () => {
    // const user = userEvent.setup();
    // const handleClick = vi.fn();
    // render(<ComponentName onClick={handleClick}>Click</ComponentName>);
    // await user.click(screen.getByRole('button', { name: 'Click' }));
    // expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // 6. KEYBOARD INTERACTION
  // Verifies the component can be operated via keyboard.
  // - Tab: focus reaches the element
  // - Enter/Space: activates buttons
  // - Escape: closes dialogs/menus
  // - Arrow keys: navigates within compound components
  // =========================================================================
  it('can be focused via Tab', async () => {
    // const user = userEvent.setup();
    // render(<ComponentName>Focus me</ComponentName>);
    // await user.tab();
    // expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
  });

  it('activates with Enter key', async () => {
    // const user = userEvent.setup();
    // const handleClick = vi.fn();
    // render(<ComponentName onClick={handleClick}>Enter</ComponentName>);
    // await user.tab();
    // await user.keyboard('{Enter}');
    // expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('activates with Space key', async () => {
    // const user = userEvent.setup();
    // const handleClick = vi.fn();
    // render(<ComponentName onClick={handleClick}>Space</ComponentName>);
    // await user.tab();
    // await user.keyboard(' ');
    // expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // 7. ARIA ATTRIBUTES
  // Verifies correct roles, labels, and states are present.
  // =========================================================================
  it('has correct ARIA attributes', () => {
    // render(<ComponentName>ARIA test</ComponentName>);
    // const el = screen.getByRole('button');
    // expect(el).not.toHaveAttribute('aria-disabled');
  });

  // =========================================================================
  // 8. DISABLED STATE
  // Verifies the component prevents interaction when disabled.
  // =========================================================================
  it('does not fire events when disabled', async () => {
    // const user = userEvent.setup();
    // const handleClick = vi.fn();
    // render(<ComponentName disabled onClick={handleClick}>Disabled</ComponentName>);
    // const el = screen.getByRole('button', { name: 'Disabled' });
    // expect(el).toBeDisabled();
    // await user.click(el);
    // expect(handleClick).not.toHaveBeenCalled();
  });

  it('cannot be focused when disabled', async () => {
    // const user = userEvent.setup();
    // render(<ComponentName disabled>Disabled</ComponentName>);
    // await user.tab();
    // expect(screen.getByRole('button', { name: 'Disabled' })).not.toHaveFocus();
  });

  // =========================================================================
  // 9. ACCESSIBILITY (axe-core)
  // Verifies the component has no accessibility violations.
  // Run axe on the default state and any important alternate states.
  // =========================================================================
  it('passes axe accessibility checks', async () => {
    // const { container } = render(<ComponentName>Accessible</ComponentName>);
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks when disabled', async () => {
    // const { container } = render(<ComponentName disabled>Disabled</ComponentName>);
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
  });
});
