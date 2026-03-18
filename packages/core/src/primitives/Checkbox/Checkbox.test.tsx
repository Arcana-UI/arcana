import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, CheckboxGroup } from './Checkbox';

describe('Checkbox', () => {
  it('renders without crashing', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAccessibleName('Accept terms');
  });

  it('renders description when provided', () => {
    render(<Checkbox label="Newsletter" description="Receive weekly updates" />);
    expect(screen.getByText('Receive weekly updates')).toBeInTheDocument();
  });

  it('renders checked state', () => {
    render(<Checkbox label="Check me" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders unchecked state', () => {
    render(<Checkbox label="Check me" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders disabled state', () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders error message', () => {
    render(<Checkbox label="Accept" error="You must accept" />);
    expect(screen.getByText('You must accept')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Click me" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Disabled" disabled onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks when checked', async () => {
    const { container } = render(<Checkbox label="Checked" checked onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Checkbox label="Required" error="Please check this" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── CheckboxGroup ────────────────────────────────────────────────────────

const groupOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

describe('CheckboxGroup', () => {
  it('renders all options', () => {
    render(<CheckboxGroup options={groupOptions} label="Pick" />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('renders group label as legend', () => {
    render(<CheckboxGroup options={groupOptions} label="Preferences" />);
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('checks selected values', () => {
    render(<CheckboxGroup options={groupOptions} value={['a', 'b']} label="Pick" />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('calls onChange with updated values on check', () => {
    const onChange = vi.fn();
    render(<CheckboxGroup options={groupOptions} value={['a']} onChange={onChange} label="Pick" />);
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('calls onChange with removed value on uncheck', () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup options={groupOptions} value={['a', 'b']} onChange={onChange} label="Pick" />,
    );
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  it('renders error message', () => {
    render(<CheckboxGroup options={groupOptions} error="Pick at least one" label="Pick" />);
    expect(screen.getByText('Pick at least one')).toBeInTheDocument();
  });

  it('disables individual options', () => {
    render(<CheckboxGroup options={groupOptions} label="Pick" />);
    expect(screen.getAllByRole('checkbox')[2]).toBeDisabled();
  });

  it('renders as fieldset', () => {
    const { container } = render(<CheckboxGroup options={groupOptions} label="Pick" />);
    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <CheckboxGroup options={groupOptions} value={['a']} label="Pick" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
