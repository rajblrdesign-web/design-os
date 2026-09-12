"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InspirationImage } from "@/components/common/InspirationImage";
import { ImageUploadDropzone } from "@/components/common/ImageUploadDropzone";
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
import {
  fetchLinkPreviewImage,
  LINK_PREVIEW_TIMEOUT_MS,
  resolveInspirationImageUrl,
} from "@/lib/link-preview";
import { inspirationToFormValues } from "@/lib/inspiration-utils";
import {
  type Inspiration,
  type InspirationFormValues,
} from "@/types/inspiration";

export const inspirationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  industry: z.string().min(1, "Industry is required"),
  url: z.string().url("Enter a valid URL"),
  tags: z.string().min(1, "Add at least one tag"),
  imageUrl: z.string(),
});

type InspirationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  inspiration?: Inspiration;
  onSubmit: (values: InspirationFormValues) => Promise<void>;
};

export function InspirationFormDialog({
  open,
  onOpenChange,
  mode,
  inspiration,
  onSubmit,
}: InspirationFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(
    null
  );
  const [previewState, setPreviewState] = React.useState<
    "idle" | "loading" | "loaded" | "fallback" | "uploaded"
  >("idle");
  const [showUpload, setShowUpload] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InspirationFormValues>({
    resolver: zodResolver(inspirationFormSchema),
    defaultValues: {
      title: "",
      company: "",
      industry: "",
      imageUrl: "",
      url: "",
      tags: "",
    },
  });

  const linkUrl = watch("url");

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && inspiration) {
      reset(inspirationToFormValues(inspiration));
      setPreviewImageUrl(inspiration.imageUrl);
      setPreviewState("loaded");
      setShowUpload(false);
      return;
    }

    reset({
      title: "",
      company: "",
      industry: "",
      imageUrl: "",
      url: "",
      tags: "",
    });
    setPreviewImageUrl(null);
    setPreviewState("idle");
    setShowUpload(false);
  }, [open, mode, inspiration, reset]);

  React.useEffect(() => {
    const trimmedUrl = linkUrl.trim();

    if (!trimmedUrl) {
      setPreviewImageUrl(null);
      setPreviewState("idle");
      setValue("imageUrl", "");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setPreviewImageUrl(null);
      setPreviewState("idle");
      return;
    }

    if (
      mode === "edit" &&
      inspiration &&
      trimmedUrl === inspiration.url &&
      inspiration.imageUrl
    ) {
      setPreviewImageUrl(inspiration.imageUrl);
      setValue("imageUrl", inspiration.imageUrl);
      setPreviewState("loaded");
      setShowUpload(false);
      return;
    }

    let cancelled = false;
    let previewTimeoutId: number | undefined;

    const applyFallback = () => {
      if (cancelled) {
        return;
      }

      setPreviewImageUrl(null);
      setValue("imageUrl", "");
      setPreviewState("fallback");
      setShowUpload(true);
    };

    setPreviewImageUrl(null);
    setPreviewState("loading");
    setShowUpload(false);

    const debounceId = window.setTimeout(() => {
      previewTimeoutId = window.setTimeout(
        applyFallback,
        LINK_PREVIEW_TIMEOUT_MS
      );

      void fetchLinkPreviewImage(trimmedUrl).then((imageUrl) => {
        if (previewTimeoutId !== undefined) {
          window.clearTimeout(previewTimeoutId);
        }

        if (cancelled) {
          return;
        }

        if (imageUrl) {
          setPreviewImageUrl(imageUrl);
          setValue("imageUrl", imageUrl);
          setPreviewState("loaded");
          setShowUpload(false);
          return;
        }

        applyFallback();
      });
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(debounceId);
      if (previewTimeoutId !== undefined) {
        window.clearTimeout(previewTimeoutId);
      }
    };
  }, [linkUrl, mode, inspiration, setValue]);

  const handleUploadedImage = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setValue("imageUrl", imageUrl, { shouldValidate: true });
    setPreviewState("uploaded");
    setShowUpload(true);
  };

  const onFormSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const explicitImageUrl =
        values.imageUrl.trim() || previewImageUrl?.trim() || "";

      const imageUrl = explicitImageUrl
        ? explicitImageUrl
        : await resolveInspirationImageUrl(
            values.url.trim(),
            inspiration?.imageUrl
          );

      await onSubmit({
        ...values,
        imageUrl,
      });

      if (mode === "add") {
        reset();
        setPreviewImageUrl(null);
        setPreviewState("idle");
        setShowUpload(false);
      }

      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  });

  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden sm:max-w-md">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {isEdit ? "Edit Inspiration" : "Add Inspiration"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this design reference in your library."
              : "Save a new design reference to your library."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onFormSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <input type="hidden" {...register("imageUrl")} />
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
            <Field label="Title" error={errors.title?.message}>
              <Input {...register("title")} placeholder="Minimal SaaS Dashboard" />
            </Field>

            <Field label="Company" error={errors.company?.message}>
              <Input {...register("company")} placeholder="Linear" />
            </Field>

            <Field label="Industry" error={errors.industry?.message}>
              <Input {...register("industry")} placeholder="UI Design" />
            </Field>

            <Field
              label="Link URL"
              error={errors.url?.message}
              hint="Preview is generated automatically from the page."
            >
              <Input {...register("url")} placeholder="https://linear.app" />
              <LinkPreview
                linkUrl={linkUrl}
                previewImageUrl={previewImageUrl}
                previewState={previewState}
                showUpload={showUpload}
                onShowUpload={() => setShowUpload(true)}
                onUploaded={handleUploadedImage}
              />
            </Field>

            <Field label="Tags" error={errors.tags?.message}>
              <Input {...register("tags")} placeholder="Dashboard, SaaS" />
            </Field>
          </div>

          <DialogFooter className="mx-0 mb-0 mt-auto shrink-0 gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                previewState === "loading" ||
                (previewState === "fallback" && !previewImageUrl)
              }
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save Changes"
                  : "Add Inspiration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type LinkPreviewProps = {
  linkUrl: string;
  previewImageUrl: string | null;
  previewState: "idle" | "loading" | "loaded" | "fallback" | "uploaded";
  showUpload: boolean;
  onShowUpload: () => void;
  onUploaded: (imageUrl: string) => void;
};

function LinkPreview({
  linkUrl,
  previewImageUrl,
  previewState,
  showUpload,
  onShowUpload,
  onUploaded,
}: LinkPreviewProps) {
  if (!linkUrl.trim()) {
    return null;
  }

  if (previewState === "idle") {
    return null;
  }

  const showReplaceAction =
    previewState === "loaded" && !showUpload;
  const shouldShowDropzone =
    showUpload || previewState === "fallback" || previewState === "uploaded";

  return (
    <div className="flex flex-col gap-3">
      {previewState !== "fallback" || previewImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border/60 bg-muted">
          {previewState === "loading" ? (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              Generating preview...
            </div>
          ) : previewImageUrl ? (
            <InspirationImage
              src={previewImageUrl}
              alt="Link preview"
              imageClassName="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
              Preview unavailable
            </div>
          )}
        </div>
      ) : null}

      {previewState === "loaded" ? (
        <p className="text-xs text-muted-foreground">
          Preview generated from the link.
        </p>
      ) : null}

      {previewState === "uploaded" ? (
        <p className="text-xs text-muted-foreground">
          Using your uploaded image.
        </p>
      ) : null}

      {previewState === "fallback" ? (
        <p className="text-xs text-muted-foreground">
          Preview could not be generated in time. Upload a screenshot instead.
        </p>
      ) : null}

      {showReplaceAction ? (
        <Button type="button" variant="ghost" size="sm" onClick={onShowUpload}>
          Replace with upload
        </Button>
      ) : null}

      {shouldShowDropzone ? (
        <ImageUploadDropzone onUploaded={onUploaded} />
      ) : null}
    </div>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
