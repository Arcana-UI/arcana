import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './DatePicker.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled selected date */
  value?: Date | null;
  /** Default date for uncontrolled usage */
  defaultValue?: Date | null;
  /** Callback fired when date changes */
  onChange?: (date: Date | null) => void;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message or boolean */
  error?: string | boolean;
  /** Helper text */
  helperText?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Earliest selectable date */
  min?: Date;
  /** Latest selectable date */
  max?: Date;
  /** Display format (default "MM/DD/YYYY") */
  format?: string;
  /** Show clear button */
  clearable?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(date: Date, min?: Date, max?: Date): boolean {
  if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true;
  if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true;
  return false;
}

function formatDate(date: Date, format: string): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const y = String(date.getFullYear());
  return format.replace('MM', m).replace('DD', d).replace('YYYY', y);
}

function parseDate(str: string): Date | null {
  const parts = str.split(/[/\-\.]/);
  if (parts.length !== 3) return null;
  const m = Number.parseInt(parts[0], 10) - 1;
  const d = Number.parseInt(parts[1], 10);
  const y = Number.parseInt(parts[2], 10);
  if (Number.isNaN(m) || Number.isNaN(d) || Number.isNaN(y)) return null;
  const date = new Date(y, m, d);
  if (date.getMonth() !== m || date.getDate() !== d) return null;
  return date;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ─── Calendar Grid ──────────────────────────────────────────────────────────

interface CalendarProps {
  viewDate: Date;
  selected: Date | null;
  today: Date;
  min?: Date;
  max?: Date;
  onSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  id: string;
}

function Calendar({
  viewDate,
  selected,
  today,
  min,
  max,
  onSelect,
  onPrevMonth,
  onNextMonth,
  id,
}: CalendarProps): React.JSX.Element {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className={styles.calendar} role="dialog" aria-label="Choose date" id={id}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          className={styles.calendarNavBtn}
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className={styles.calendarTitle}>
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          className={styles.calendarNavBtn}
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className={styles.calendarGrid}>
        <div className={styles.calendarWeekdays}>
          {DAYS.map((day) => (
            <span key={day} className={styles.calendarWeekday} aria-hidden="true">
              {day}
            </span>
          ))}
        </div>
        <div className={styles.calendarDays}>
          {cells.map((date, idx) => {
            if (!date) {
              // biome-ignore lint/suspicious/noArrayIndexKey: empty calendar cells
              return <span key={`empty-${idx}`} className={styles.calendarEmpty} />;
            }
            const disabled = isDateDisabled(date, min, max);
            const isToday = isSameDay(date, today);
            const isSelected = selected ? isSameDay(date, selected) : false;

            return (
              <button
                key={date.getDate()}
                type="button"
                className={cn(
                  styles.calendarDay,
                  isToday && styles.calendarDayToday,
                  isSelected && styles.calendarDaySelected,
                  disabled && styles.calendarDayDisabled,
                )}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-disabled={disabled || undefined}
                onClick={() => onSelect(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── DatePicker ─────────────────────────────────────────────────────────────

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue = null,
      onChange,
      label,
      placeholder = 'MM/DD/YYYY',
      error,
      helperText,
      disabled = false,
      min,
      max,
      format = 'MM/DD/YYYY',
      clearable = true,
      size = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const pickerId = id ?? generatedId;
    const calendarId = `${pickerId}-calendar`;
    const errorId = `${pickerId}-error`;
    const helperId = `${pickerId}-helper`;

    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
    const [inputText, setInputText] = useState('');
    const [viewDate, setViewDate] = useState(() => controlledValue ?? defaultValue ?? new Date());
    const today = useMemo(() => new Date(), []);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = controlledValue !== undefined ? controlledValue : internalValue;

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // Sync input text with selected value
    useEffect(() => {
      if (selected) {
        setInputText(formatDate(selected, format));
      } else {
        setInputText('');
      }
    }, [selected, format]);

    const updateValue = useCallback(
      (date: Date | null) => {
        if (controlledValue === undefined) setInternalValue(date);
        onChange?.(date);
      },
      [controlledValue, onChange],
    );

    const handleSelect = useCallback(
      (date: Date) => {
        updateValue(date);
        setIsOpen(false);
        inputRef.current?.focus();
      },
      [updateValue],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputText(text);
        const parsed = parseDate(text);
        if (parsed && !isDateDisabled(parsed, min, max)) {
          updateValue(parsed);
          setViewDate(parsed);
        }
      },
      [updateValue, min, max],
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        updateValue(null);
        setInputText('');
      },
      [updateValue],
    );

    // Click outside to close
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.focus();
        }
      },
      [isOpen],
    );

    return (
      <div
        ref={ref}
        className={cn(styles.datepicker, styles[`size-${size}`], className)}
        {...props}
      >
        {label && (
          <label htmlFor={pickerId} className={styles.label}>
            {label}
          </label>
        )}

        <div ref={wrapperRef} className={styles.controlArea} onKeyDown={handleKeyDown}>
          <div
            className={cn(
              styles.inputWrapper,
              hasError && styles.hasError,
              disabled && styles.disabled,
              isOpen && styles.open,
            )}
          >
            <input
              ref={inputRef}
              id={pickerId}
              type="text"
              role="combobox"
              className={styles.input}
              placeholder={placeholder}
              value={inputText}
              onChange={handleInputChange}
              onFocus={() => !disabled && setIsOpen(true)}
              disabled={disabled}
              aria-invalid={hasError || undefined}
              aria-describedby={
                [errorMessage && errorId, helperText && helperId].filter(Boolean).join(' ') ||
                undefined
              }
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={isOpen ? calendarId : undefined}
              autoComplete="off"
            />
            <span className={styles.icons}>
              {clearable && selected && !disabled && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClear}
                  aria-label="Clear date"
                  tabIndex={-1}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                className={styles.calendarBtn}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                aria-label="Open calendar"
                tabIndex={-1}
                disabled={disabled}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
            </span>
          </div>

          {isOpen && (
            <Calendar
              id={calendarId}
              viewDate={viewDate}
              selected={selected}
              today={today}
              min={min}
              max={max}
              onSelect={handleSelect}
              onPrevMonth={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              onNextMonth={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            />
          )}
        </div>

        {errorMessage && (
          <span id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </span>
        )}
        {helperText && !errorMessage && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
DatePicker.displayName = 'DatePicker';
