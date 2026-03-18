import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Description text displayed below the label */
  description?: string;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Error message string or boolean error state */
  error?: string | boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, description, indeterminate = false, error, className, id, onChange, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const descId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;
    const internalRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) return;
      onChange?.(e);
    };

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <div className={cn(styles.wrapper, className)}>
        <div className={styles.row}>
          <div className={styles.checkboxWrapper}>
            <input
              ref={resolvedRef}
              type="checkbox"
              id={inputId}
              className={cn(styles.input, hasError && styles.hasError)}
              aria-invalid={hasError || undefined}
              aria-describedby={
                [description && descId, errorMessage && errorId].filter(Boolean).join(' ') ||
                undefined
              }
              onChange={handleChange}
              {...props}
            />
            <span className={styles.indicator} aria-hidden="true">
              {indeterminate ? (
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </div>
          {(label || description) && (
            <div className={styles.labelGroup}>
              {label && (
                <label htmlFor={inputId} className={styles.label}>
                  {label}
                </label>
              )}
              {description && (
                <span id={descId} className={styles.description}>
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
        {errorMessage && (
          <span id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

// ─── CheckboxGroup ───────────────────────────────────────────────────────────

export interface CheckboxGroupOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
  /** Description text below the label */
  description?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** Array of checkbox options */
  options: CheckboxGroupOption[];
  /** Currently selected values */
  value?: string[];
  /** Callback fired when selection changes */
  onChange?: (values: string[]) => void;
  /** Layout direction */
  orientation?: 'vertical' | 'horizontal';
  /** Group label */
  label?: string;
  /** Error message */
  error?: string;
  /** Additional CSS class */
  className?: string;
}

export const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  ({ options, value = [], onChange, orientation = 'vertical', label, error, className }, ref) => {
    const groupId = React.useId();
    const errorId = `${groupId}-error`;

    const handleChange = (optValue: string, checked: boolean) => {
      const next = checked ? [...value, optValue] : value.filter((v) => v !== optValue);
      onChange?.(next);
    };

    return (
      <fieldset
        ref={ref}
        className={cn(styles.checkboxGroup, className)}
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {label && (
          <legend id={`${groupId}-label`} className={styles.groupLabel}>
            {label}
          </legend>
        )}
        <div
          className={cn(
            styles.groupOptions,
            orientation === 'horizontal' && styles.groupHorizontal,
          )}
        >
          {options.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              description={opt.description}
              checked={value.includes(opt.value)}
              disabled={opt.disabled}
              onChange={(e) => handleChange(opt.value, e.target.checked)}
            />
          ))}
        </div>
        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
      </fieldset>
    );
  },
);
CheckboxGroup.displayName = 'CheckboxGroup';
