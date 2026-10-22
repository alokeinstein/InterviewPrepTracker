'use client';

import React, { useState, useEffect } from 'react';
import { DraftCheckpoint, localStore } from '@/lib/storage/indexedDb';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bookmark, Clock, ArrowRight, Plus, Trash2, Check, AlertTriangle } from 'lucide-react';

interface ProblemCheckpointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  language: string;
  currentCode: string;
  onRestoreCheckpoint: (code: string) => void;
}

export function ProblemCheckpointsModal({
  isOpen,
  onClose,
  problemId,
  language,
  currentCode,
  onRestoreCheckpoint,
}: ProblemCheckpointsModalProps) {
  const [checkpoints, setCheckpoints] = useState<DraftCheckpoint[]>([]);
  const [checkpointName, setCheckpointName] = useState('');
  const [checkpointDesc, setCheckpointDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  const loadCheckpoints = async () => {
    const list = await localStore.listCheckpoints(problemId);
    setCheckpoints(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadCheckpoints();
      setConfirmRestoreId(null);
    }
  }, [isOpen, problemId]);

  const handleCreate = async () => {
    if (!checkpointName.trim()) return;
    setIsCreating(true);
    try {
      await localStore.saveCheckpoint(
        problemId,
        language,
        checkpointName.trim(),
        currentCode,
        checkpointDesc.trim() || undefined
      );
      setCheckpointName('');
      setCheckpointDesc('');
      await loadCheckpoints();
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (cp: DraftCheckpoint) => {
    // Preserve current draft before replacing, ensuring zero data loss
    if (currentCode && currentCode.trim().length > 0 && currentCode.trim() !== cp.code.trim()) {
      await localStore.saveCheckpoint(
        problemId,
        language,
        `Auto-backup (before restoring ${cp.name})`,
        currentCode,
        'Automatic snapshot preserved prior to checkpoint restoration'
      );
    }
    onRestoreCheckpoint(cp.code);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Named Draft Checkpoints"
      description="Save checkpoints of your algorithmic ideas (e.g., Brute Force, Monotonic Stack, Optimal) and restore anytime."
    >
      <div className="space-y-6">
        {/* Create new checkpoint section */}
        <div className="p-4 rounded-lg bg-card/60 border border-border space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-primary" /> Save Current Code as Checkpoint
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              value={checkpointName}
              onChange={(e) => setCheckpointName(e.target.value)}
              placeholder="Checkpoint name (e.g. 'Brute Force O(N^2)', 'Two Pointers O(N)')"
              className="w-full px-3 py-1.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={checkpointDesc}
              onChange={(e) => setCheckpointDesc(e.target.value)}
              placeholder="Optional notes / complexity / invariant notes"
              className="w-full px-3 py-1.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                className="h-7 text-xs"
                disabled={!checkpointName.trim() || isCreating}
                onClick={handleCreate}
              >
                <Bookmark className="h-3 w-3 mr-1" />
                Save Checkpoint
              </Button>
            </div>
          </div>
        </div>

        {/* Existing checkpoints list */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Saved Checkpoints ({checkpoints.length})
          </h4>

          {checkpoints.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No checkpoints saved yet for this question.
            </p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="p-3 rounded-lg border border-border/80 bg-background/60 hover:bg-background/90 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      <Bookmark className="h-3.5 w-3.5 text-primary" />
                      {cp.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(cp.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {cp.description && (
                    <p className="text-xs text-muted-foreground italic pl-5">
                      {cp.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {cp.language}
                    </Badge>

                    {confirmRestoreId === cp.id ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Overwrite editor?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-6 px-2 text-[10px]"
                          onClick={() => handleRestore(cp)}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1.5 text-[10px]"
                          onClick={() => setConfirmRestoreId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs text-primary hover:text-primary"
                        onClick={() => setConfirmRestoreId(cp.id)}
                      >
                        Restore Draft
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
