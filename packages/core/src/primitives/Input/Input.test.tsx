import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  // --- Smoke test ---
  it('renders without errors', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // --- Ref forwarding ---
  it('forwards ref to the underlying input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // --- className passthrough ---
  it('passes through className to the input element', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  // --- Label association ---
  it('renders label associated to input via htmlFor', () => {
    render(<Input label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('uses provided id for label association', () => {
    render(<Input label="Username" id="my-input" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'my-input');
  });

  // --- Error handling ---
  it('renders error message with role="alert"', () => {
    render(<Input error="This field is required" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('This field is required');
  });

  it('does not render alert element when error is boolean true', () => {
    render(<Input error={true} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('marks input as aria-invalid when error is set', () => {
    render(<Input error="Invalid value" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby pointing to error message', () => {
    render(<Input error="Required" id="test-input" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('test-input-error');
  });

  // --- Helper text ---
  it('renders helper text', () => {
    render(<Input helperText="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('hides helper text when error message is present', () => {
    render(<Input helperText="Help" error="Error" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('sets aria-describedby pointing to helper text', () => {
    render(<Input helperText="Helpful text" id="help-input" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('help-input-helper');
  });

  // --- Prefix and suffix ---
  it('renders prefix and suffix elements', () => {
    render(
      <Input
        prefix={<span data-testid="prefix">$</span>}
        suffix={<span data-testid="suffix">.00</span>}
      />,
    );
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  // --- Event handlers ---
  it('fires onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5); // one per character
  });

  it('fires onFocus and onBlur', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    await user.tab();
    expect(handleFocus).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  // --- Keyboard interaction ---
  it('can be focused via Tab', async () => {
    const user = userEvent.setup();
    render(<Input />);
    await user.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('accepts keyboard input', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('test value');
    expect(input).toHaveValue('test value');
  });

  // --- Disabled state ---
  it('renders in disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input disabled onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- fullWidth prop ---
  it('renders fullWidth without crashing', () => {
    const { container } = render(<Input fullWidth />);
    expect(container.firstChild).toBeInTheDocument();
  });

  // --- Accessibility ---
  it('passes axe accessibility checks', async () => {
    const { container } = render(<Input label="Username" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Input label="Username" error="Required" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks when disabled', async () => {
    const { container } = render(<Input label="Username" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
