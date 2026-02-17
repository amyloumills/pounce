import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Modal } from '../Modal';

describe('Modal', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = 'unset';
  });

  const renderModal = (props = {}) => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal" {...props}>
        <p>Modal content</p>
      </Modal>
    );

    return { onClose };
  };

  it('renders when open', () => {
    renderModal();

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Hidden">
        Content
      </Modal>
    );

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('locks body scroll when open', () => {
    renderModal();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll on unmount', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        Content
      </Modal>
    );

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });

  it('calls onClose when clicking backdrop', () => {
    const { onClose } = renderModal();

    // backdrop = outer div
    const backdrop = screen.getByText('Test Modal').closest('.fixed') as HTMLElement;

    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT close when clicking inside modal content', () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByText('Modal content'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking close button', () => {
    const { onClose } = renderModal();

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
