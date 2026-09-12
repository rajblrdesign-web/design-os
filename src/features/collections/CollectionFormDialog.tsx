"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { collectionToFormValues } from "@/lib/collection-utils";
import {
  type Collection,
  type CollectionFormValues,
} from "@/types/collection";

export const collectionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
});

type CollectionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  collection?: Pick<Collection, "name" | "description">;
  onSubmit: (values: CollectionFormValues) => Promise<void>;
};

export function CollectionFormDialog({
  open,
  onOpenChange,
  mode,
  collection,
  onSubmit,
}: CollectionFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && collection) {
      reset(collectionToFormValues(collection));
      return;
    }

    reset({
      name: "",
      description: "",
    });
  }, [open, mode, collection, reset]);

  const onFormSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      if (mode === "add") {
        reset();
      }
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  });

  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Collection" : "Create Collection"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the name and description for this collection."
              : "Group related inspirations into a curated set."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
          <Field label="Name" error={errors.name?.message}>
            <Input {...register("name")} placeholder="SaaS Dashboards" />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <Input
              {...register("description")}
              placeholder="Optional short description"
            />
          </Field>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
