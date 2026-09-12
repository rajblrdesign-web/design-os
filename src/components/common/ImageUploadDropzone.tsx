"use client";

import { ImageIcon, UploadIcon } from "lucide-react";
import * as React from "react";

import { InspirationImage } from "@/components/common/InspirationImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import { uploadInspirationImage } from "@/services/inspiration-image-service";

type ImageUploadDropzoneProps = {
  onUploaded: (imageUrl: string) => void;
  previewUrl?: string | null;
  className?: string;
};

export function ImageUploadDropzone({
  onUploaded,
  previewUrl,
  className,
}: ImageUploadDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setError(null);
    setIsUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return objectUrl;
    });

    try {
      const imageUrl = await uploadInspirationImage(file);
      onUploaded(imageUrl);
      showSuccess("Image uploaded");
    } catch (uploadError) {
      const message = getErrorMessage(
        uploadError,
        "Failed to upload image."
      );
      setError(message);
      showError("Could not upload image", message);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  };

  const displayUrl = previewUrl ?? localPreviewUrl;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {displayUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border/60 bg-muted">
          <InspirationImage
            src={displayUrl}
            alt="Uploaded preview"
            imageClassName="object-cover"
          />
        </div>
      ) : null}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          isDragging
            ? "border-foreground/40 bg-muted/60"
            : "border-border/70 bg-muted/20"
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-background ring-1 ring-border/60">
          {isUploading ? (
            <UploadIcon className="size-4 animate-pulse text-muted-foreground" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isUploading ? "Uploading..." : "Upload an image"}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag and drop a screenshot, or browse files
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
