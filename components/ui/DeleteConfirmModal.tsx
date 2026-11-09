"use client";

import { WarningCircle } from "@phosphor-icons/react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  itemName,
  loading = false,
  title = "Delete item",
  description,
}: DeleteConfirmModalProps) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone.";

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-border">
          <WarningCircle size={20} weight="fill" className="text-red-500 dark:text-red-400" />
        </div>
        <h2 className="font-heading text-lg font-medium text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {description ?? defaultDescription}
        </p>
        <div className="mt-6 flex w-full gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-red-500 hover:bg-red-600 focus:ring-red-400/40 active:bg-red-700"
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
