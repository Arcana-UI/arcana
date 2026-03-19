import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders with message', () => {
    render(<Banner>System maintenance tonight</Banner>);
    expect(screen.getByText('System maintenance tonight')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Banner title="Notice">Details here</Banner>);
    expect(screen.getByText('Notice')).toBeInTheDocument();
  });

  it('renders info variant with role="status"', () => {
    render(<Banner variant="info">Info</Banner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error variant with role="alert"', () => {
    render(<Banner variant="error">Error</Banner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders warning variant with role="alert"', () => {
    render(<Banner variant="warning">Warning</Banner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders action', () => {
    render(<Banner action={<button type="button">Retry</button>}>Failed</Banner>);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('dismisses when close button clicked', async () => {
    const onDismiss = vi.fn();
    render(
      <Banner dismissible onDismiss={onDismiss}>
        Message
      </Banner>,
    );
    await userEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalled();
    expect(screen.queryByText('Message')).not.toBeInTheDocument();
  });

  it('renders sticky variant', () => {
    const { container } = render(<Banner sticky>Sticky</Banner>);
    expect(container.querySelector('[class*="sticky"]')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Banner ref={ref}>Test</Banner>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(
      <Banner variant="info" title="Notice">
        Details
      </Banner>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
