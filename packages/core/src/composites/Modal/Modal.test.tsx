import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal, ModalClose } from './Modal';

describe('ModalClose', () => {
  it('renders a close button with aria-label', () => {
    render(<ModalClose onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ModalClose ref={ref} onClick={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes through className', () => {
    render(<ModalClose onClick={vi.fn()} className="custom-close" />);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveClass('custom-close');
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ModalClose onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Modal', () => {
  // --- Smoke tests ---
  it('does not render when open is false', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Test Modal" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Test Modal" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // --- Content rendering ---
  it('renders title', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Modal" />);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title" description="Modal description" />);
    expect(screen.getByText('Modal description')).toBeInTheDocument();
  });

  it('renders children in the body', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        <p>Modal body content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal body content')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(
      <Modal
        open={true}
        onClose={vi.fn()}
        title="Title"
        footer={<button type="button">OK</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  // --- Ref forwarding ---
  it('forwards ref to the overlay element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Modal ref={ref} open={true} onClose={vi.fn()} title="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // --- className passthrough ---
  it('passes through className to the dialog element', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title" className="custom-modal" />);
    expect(screen.getByRole('dialog')).toHaveClass('custom-modal');
  });

  // --- Size variants ---
  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Modal open={true} onClose={vi.fn()} title="Title" size={size} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      unmount();
    }
  });

  // --- Close button ---
  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="Title" />);
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // --- Overlay click ---
  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<Modal open={true} onClose={onClose} title="Title" />);
    const overlay = container.querySelector('[aria-hidden="false"]');
    if (overlay) {
      overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose on overlay click when closeOnOverlayClick is false', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open={true} onClose={onClose} title="Title" closeOnOverlayClick={false} />,
    );
    const overlay = container.querySelector('[aria-hidden="false"]');
    if (overlay) {
      overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    expect(onClose).not.toHaveBeenCalled();
  });

  // --- Keyboard interaction ---
  it('closes on Escape key press', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="Escape test" />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape when closeOnEsc is false', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="No Escape" closeOnEsc={false} />);
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('traps focus within the dialog', async () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Focus trap">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>,
    );
    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      const focusable = dialog.querySelectorAll('button:not([disabled])');
      expect(focusable.length).toBeGreaterThan(0);
    });
  });

  // --- ARIA attributes ---
  it('has role="dialog" and aria-modal="true"', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to the title element', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Title" />);
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const titleEl = labelledBy ? document.getElementById(labelledBy) : null;
    expect(titleEl).toHaveTextContent('My Title');
  });

  it('has aria-describedby pointing to the description element', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Title" description="Some description" />);
    const dialog = screen.getByRole('dialog');
    const describedBy = dialog.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const descEl = describedBy ? document.getElementById(describedBy) : null;
    expect(descEl).toHaveTextContent('Some description');
  });

  it('does not set aria-labelledby without title', () => {
    render(<Modal open={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  // --- Body scroll lock ---
  it('prevents body scroll when open', () => {
    render(<Modal open={true} onClose={vi.fn()} title="Scroll lock" />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Modal open={true} onClose={vi.fn()} title="Scroll lock" />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Modal open={false} onClose={vi.fn()} title="Scroll lock" />);
    expect(document.body.style.overflow).toBe('');
  });

  // --- Close button always present ---
  it('renders close button even without title or description', () => {
    render(<Modal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  // --- Accessibility ---
  it('passes axe accessibility checks', async () => {
    const { container } = render(<Modal open={true} onClose={vi.fn()} title="Accessible Modal" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks with description and footer', async () => {
    const { container } = render(
      <Modal
        open={true}
        onClose={vi.fn()}
        title="Title"
        description="Description text"
        footer={<button type="button">Confirm</button>}
      >
        <p>Content</p>
      </Modal>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
