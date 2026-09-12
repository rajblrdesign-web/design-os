"use client";

import { CollectionFormDialog } from "@/features/collections/CollectionFormDialog";
import { type CollectionFormValues } from "@/types/collection";

type AddCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CollectionFormValues) => Promise<void>;
};

export function AddCollectionDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCollectionDialogProps) {
  return (
    <CollectionFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="add"
      onSubmit={onSubmit}
    />
  );
}
