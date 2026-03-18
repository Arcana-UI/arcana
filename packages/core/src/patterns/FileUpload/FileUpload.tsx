import React, { useCallback, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './FileUpload.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError'> {
  /** File type filter (e.g., "image/*,.pdf") */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files when multiple */
  maxFiles?: number;
  /** Callback fired when files are selected */
  onChange?: (files: File[]) => void;
  /** Callback fired on validation errors */
  onError?: (error: string) => void;
  /** Label text */
  label?: string;
  /** Description text (e.g., "PNG, JPG, PDF up to 10MB") */
  description?: string;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Visual variant */
  variant?: 'dropzone' | 'button';
  /** Additional CSS class */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── FileUpload ─────────────────────────────────────────────────────────────

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      onChange,
      onError,
      label,
      description,
      disabled = false,
      variant = 'dropzone',
      className,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const validate = useCallback(
      (fileList: File[]): File[] => {
        const valid: File[] = [];
        for (const file of fileList) {
          if (maxSize && file.size > maxSize) {
            onError?.(`${file.name} exceeds ${formatFileSize(maxSize)} limit`);
            continue;
          }
          valid.push(file);
        }
        if (maxFiles && valid.length > maxFiles) {
          onError?.(`Maximum ${maxFiles} files allowed`);
          return valid.slice(0, maxFiles);
        }
        return valid;
      },
      [maxSize, maxFiles, onError],
    );

    const handleFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList) return;
        const incoming = Array.from(fileList);
        const validated = validate(incoming);
        const next = multiple ? [...files, ...validated] : validated.slice(0, 1);
        if (maxFiles && next.length > maxFiles) {
          onError?.(`Maximum ${maxFiles} files allowed`);
          const trimmed = next.slice(0, maxFiles);
          setFiles(trimmed);
          onChange?.(trimmed);
          return;
        }
        setFiles(next);
        onChange?.(next);
      },
      [files, multiple, maxFiles, validate, onChange, onError],
    );

    const handleRemove = useCallback(
      (index: number) => {
        const next = files.filter((_, i) => i !== index);
        setFiles(next);
        onChange?.(next);
      },
      [files, onChange],
    );

    const handleClick = useCallback(() => {
      if (!disabled) inputRef.current?.click();
    }, [disabled]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      },
      [disabled],
    );

    const handleDragOver = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
      },
      [disabled],
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      },
      [disabled, handleFiles],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // Reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = '';
      },
      [handleFiles],
    );

    return (
      <div ref={ref} className={cn(styles.fileUpload, className)} {...props}>
        {label && <span className={styles.label}>{label}</span>}

        <input
          ref={inputRef}
          type="file"
          className={styles.hiddenInput}
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label={label ?? 'Upload file'}
          tabIndex={-1}
        />

        {variant === 'dropzone' ? (
          <div
            className={cn(
              styles.dropzone,
              isDragOver && styles.dropzoneActive,
              disabled && styles.dropzoneDisabled,
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={label ? `${label} dropzone` : 'File upload dropzone'}
          >
            <svg
              className={styles.dropzoneIcon}
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className={styles.dropzoneText}>
              Drag and drop or <span className={styles.dropzoneLink}>click to upload</span>
            </span>
            {description && <span className={styles.dropzoneDescription}>{description}</span>}
          </div>
        ) : (
          <button
            type="button"
            className={cn(styles.uploadButton, disabled && styles.uploadButtonDisabled)}
            onClick={handleClick}
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
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Choose {multiple ? 'files' : 'file'}
          </button>
        )}

        {/* File list */}
        {files.length > 0 && (
          <ul className={styles.fileList} aria-label="Selected files">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}`} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  className={styles.fileRemove}
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove ${file.name}`}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
FileUpload.displayName = 'FileUpload';
