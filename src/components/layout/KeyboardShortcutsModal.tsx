'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { key: '⌘ / Ctrl + K', description: 'Global Search across all concepts and problems' },
    { key: 'F', description: 'Toggle Distraction-Free Focus Mode' },
    { key: 'N', description: 'Proceed to Next Step / Next Question' },
    { key: 'H', description: 'Request Socratic Hint (Level 1–5)' },
    { key: 'S', description: 'Submit Code / Confirm Answer' },
    { key: 'R', description: 'Open Overdue Revision Queue' },
    { key: 'Esc', description: 'Close modals, drawers, or exit focus mode' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Navigation Shortcuts"
      description="Keyboard-first commands for zero-friction interview training."
    >
      <div className="space-y-2">
        {shortcuts.map((sc) => (
          <div
            key={sc.key}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border text-sm"
          >
            <span className="text-muted-foreground">{sc.description}</span>
            <kbd className="px-2 py-0.5 rounded bg-background border border-border font-mono text-xs font-semibold text-foreground shadow-sm">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
