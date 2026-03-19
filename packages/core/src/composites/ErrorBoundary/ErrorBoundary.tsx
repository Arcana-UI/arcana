import React from 'react';
import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryProps {
  /** Fallback UI — ReactNode or render function receiving error and reset */
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  /** Callback fired when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Children to render */
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }
      if (fallback) {
        return fallback;
      }
      // Default fallback
      return (
        <div className={styles.fallback} role="alert">
          <div className={styles.icon} aria-hidden="true">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.description}>{error.message}</p>
          <button type="button" className={styles.retryButton} onClick={this.reset}>
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}
