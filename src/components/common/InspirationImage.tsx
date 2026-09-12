"use client";

import { ImageIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type InspirationImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function InspirationImage({
  src,
  alt,
  className,
  imageClassName,
}: InspirationImageProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex size-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
          className
        )}
      >
        <ImageIcon className="size-8 opacity-50" aria-hidden />
        <span className="px-4 text-center text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={cn("size-full object-cover", imageClassName)}
    />
  );
}
