import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Banner.module.css';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  /** Optional title */
  title?: string;
  /** Message content */
  children?: React.ReactNode;
  /** Custom icon (defaults to variant icon) */
  icon?: React.ReactNode;
  /** Action element (button or link) */
  action?: React.ReactNode;
  /** Whether the banner can be dismissed */
  dismissible?: boolean;
  /** Callback fired when dismissed */
  onDismiss?: () => void;
  /** Stick to top of page */
  sticky?: boolean;
  /** Additional CSS class */
  className?: string;
}

const ICONS: Record<string, React.JSX.Element> = {
  info: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  neutral: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = 'info',
      title,
      children,
      icon,
      action,
      dismissible = false,
      onDismiss,
      sticky = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          styles.banner,
          styles[`variant-${variant}`],
          sticky && styles.sticky,
          className,
        )}
        {...props}
      >
        <div className={styles.content}>
          <span className={styles.icon}>{icon ?? ICONS[variant]}</span>
          <div className={styles.text}>
            {title && <span className={styles.title}>{title}</span>}
            {children && <span className={styles.message}>{children}</span>}
          </div>
        </div>
        <div className={styles.actions}>
          {action}
          {dismissible && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleDismiss}
              aria-label="Dismiss"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  },
);
Banner.displayName = 'Banner';
