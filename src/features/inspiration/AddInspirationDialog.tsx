"use client";

import { InspirationFormDialog } from "@/features/inspiration/InspirationFormDialog";
import { type InspirationFormValues } from "@/types/inspiration";

type AddInspirationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InspirationFormValues) => Promise<void>;
};

export function AddInspirationDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddInspirationDialogProps) {
  return (
    <InspirationFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="add"
      onSubmit={onSubmit}
    />
  );
}
