import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

describe('Select', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders without crashing', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select label="Choose one" options={options} />);
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    render(<Select placeholder="Pick an option" options={options} />);
    expect(screen.getByText('Pick an option')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Select error="Required field" options={options} />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text', () => {
    render(<Select helperText="Select one of the options" options={options} />);
    expect(screen.getByText('Select one of the options')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  // ─── Dropdown ───────────────────────────────────────────────────────
  it('opens dropdown on click', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
  });

  it('selects an option on click', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Option A' }));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('closes dropdown after single selection', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Option A' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('displays selected option label in trigger', async () => {
    render(<Select options={options} value="b" />);
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  // ─── Multiple ───────────────────────────────────────────────────────
  it('supports multiple selection', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Option A' }));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('keeps dropdown open in multiple mode', async () => {
    render(<Select options={options} multiple />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Option A' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows selected count in multiple mode', () => {
    render(<Select options={options} value={['a', 'b']} multiple />);
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  // ─── Searchable ─────────────────────────────────────────────────────
  it('shows search input when searchable', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('filters options based on search', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Option A' } });
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Option B' })).not.toBeInTheDocument();
  });

  it('shows no results message when search has no matches', async () => {
    render(<Select options={options} searchable />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('Search...'), 'xyz');
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  // ─── Clearable ──────────────────────────────────────────────────────
  it('shows clear button when clearable and has value', () => {
    render(<Select options={options} value="a" clearable />);
    expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
  });

  it('clears selection when clear button is clicked', async () => {
    const onChange = vi.fn();
    render(<Select options={options} value="a" clearable onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Clear selection'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  // ─── Grouped ────────────────────────────────────────────────────────
  it('renders grouped options', async () => {
    const grouped = [
      { value: '1', label: 'Apple', group: 'Fruits' },
      { value: '2', label: 'Banana', group: 'Fruits' },
      { value: '3', label: 'Carrot', group: 'Vegetables' },
    ];
    render(<Select options={grouped} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  // ─── Keyboard ───────────────────────────────────────────────────────
  it('opens dropdown on Enter', async () => {
    render(<Select options={options} />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes dropdown on Escape', async () => {
    render(<Select options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // ─── Loading ────────────────────────────────────────────────────────
  it('shows spinner when loading', () => {
    const { container } = render(<Select options={options} loading />);
    expect(container.querySelector('[class*="spinner"]')).toBeInTheDocument();
  });

  // ─── ARIA ───────────────────────────────────────────────────────────
  it('has aria-expanded attribute', async () => {
    render(<Select options={options} />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('has aria-haspopup attribute', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('passes axe accessibility checks', async () => {
    const { container } = render(<Select label="Fruit" options={options} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks with error', async () => {
    const { container } = render(<Select label="Fruit" error="Required" options={options} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe with dropdown open', async () => {
    const { container } = render(<Select label="Fruit" options={options} />);
    await userEvent.click(screen.getByRole('combobox'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
