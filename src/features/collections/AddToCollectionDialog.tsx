"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Inspiration } from "@/types/inspiration";

type AddToCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableInspirations: Inspiration[];
  onAdd: (inspirationId: string) => Promise<void>;
};

export function AddToCollectionDialog({
  open,
  onOpenChange,
  availableInspirations,
  onAdd,
}: AddToCollectionDialogProps) {
  const [addingId, setAddingId] = React.useState<string | null>(null);

  const handleAdd = async (inspirationId: string) => {
    setAddingId(inspirationId);
    try {
      await onAdd(inspirationId);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Inspiration</DialogTitle>
          <DialogDescription>
            Choose an inspiration to add to this collection.
          </DialogDescription>
        </DialogHeader>

        {availableInspirations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            All inspirations are already in this collection.
          </p>
        ) : (
          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {availableInspirations.map((inspiration) => (
              <div
                key={inspiration.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {inspiration.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inspiration.company}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={addingId === inspiration.id}
                  onClick={() => void handleAdd(inspiration.id)}
                >
                  {addingId === inspiration.id ? "Adding..." : "Add"}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
