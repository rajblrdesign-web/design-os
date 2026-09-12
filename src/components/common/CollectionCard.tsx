"use client";

import Link from "next/link";
import { FolderIcon } from "lucide-react";

import { CollectionActionsMenu } from "@/components/common/CollectionActionsMenu";
import { InspirationImage } from "@/components/common/InspirationImage";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Collection } from "@/types/collection";

type CollectionCardProps = {
  collection: Collection;
  onEdit?: (collection: Collection) => void;
  onDelete?: (id: string) => void;
};

export function CollectionCard({
  collection,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const hasPreview = collection.previewImageUrls.length > 0;
  const showActions = onEdit && onDelete;

  return (
    <Card className="group relative overflow-hidden py-0 ring-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {showActions ? (
        <div className="absolute top-3 right-3 z-10">
          <CollectionActionsMenu
            onEdit={() => onEdit(collection)}
            onDelete={() => onDelete(collection.id)}
          />
        </div>
      ) : null}

      <Link href={`/collections/${collection.id}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {hasPreview ? (
            <div className="grid size-full grid-cols-3 gap-px bg-border/60">
              {collection.previewImageUrls.map((imageUrl, index) => (
                <div key={`${collection.id}-${index}`} className="relative bg-muted">
                  <InspirationImage
                    src={imageUrl}
                    alt=""
                    imageClassName="object-cover"
                  />
                </div>
              ))}
              {Array.from({
                length: Math.max(0, 3 - collection.previewImageUrls.length),
              }).map((_, index) => (
                <div
                  key={`${collection.id}-empty-${index}`}
                  className="bg-muted"
                />
              ))}
            </div>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <FolderIcon className="size-8 opacity-50" aria-hidden />
              <span className="text-xs">No items yet</span>
            </div>
          )}
        </div>

        <CardHeader className="gap-2 pb-3">
          <CardTitle className="line-clamp-1 text-[15px] leading-snug">
            {collection.name}
          </CardTitle>
          {collection.description ? (
            <CardDescription className="line-clamp-2 text-[13px]">
              {collection.description}
            </CardDescription>
          ) : null}
        </CardHeader>

        <CardContent className="pb-4">
          <Badge variant="secondary" className="text-xs">
            {collection.itemCount}{" "}
            {collection.itemCount === 1 ? "item" : "items"}
          </Badge>
        </CardContent>
      </Link>
    </Card>
  );
}
