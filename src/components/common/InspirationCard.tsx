"use client";

import { ExternalLinkIcon, HeartIcon, XIcon } from "lucide-react";

import { InspirationImage } from "@/components/common/InspirationImage";
import { AddToCollectionMenu } from "@/components/common/AddToCollectionMenu";
import { InspirationActionsMenu } from "@/components/common/InspirationActionsMenu";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Collection } from "@/types/collection";
import { type Inspiration } from "@/types/inspiration";

type InspirationCardProps = {
  inspiration: Inspiration;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onRemove?: (id: string) => void;
  collections?: Collection[];
  memberCollectionIds?: Set<string>;
  onAddedToCollection?: (collectionId: string) => void;
  onEdit?: (inspiration: Inspiration) => void;
  onDelete?: (id: string) => void;
};

export function InspirationCard({
  inspiration,
  isFavorite = false,
  onFavoriteToggle,
  onRemove,
  collections,
  memberCollectionIds,
  onAddedToCollection,
  onEdit,
  onDelete,
}: InspirationCardProps) {
  const showCollectionMenu =
    collections &&
    memberCollectionIds &&
    onAddedToCollection &&
    !onRemove;
  const showActions = onEdit && onDelete;
  return (
    <Card className="group overflow-hidden py-0 ring-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <InspirationImage
          src={inspiration.imageUrl}
          alt={inspiration.title}
          imageClassName="transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={() => onFavoriteToggle?.(inspiration.id)}
          className={cn(
            "absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background",
            isFavorite
              ? "text-destructive hover:text-destructive"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <HeartIcon className={cn("size-4", isFavorite && "fill-current")} />
        </Button>

        {onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove from collection"
            onClick={() => onRemove(inspiration.id)}
            className="absolute top-3 left-3 bg-background/80 text-muted-foreground backdrop-blur-sm hover:bg-background hover:text-foreground"
          >
            <XIcon className="size-4" />
          </Button>
        ) : null}

        {showCollectionMenu ? (
          <AddToCollectionMenu
            inspirationId={inspiration.id}
            collections={collections}
            memberCollectionIds={memberCollectionIds}
            onAdded={onAddedToCollection}
            className="absolute bottom-3 left-3"
          />
        ) : null}
      </div>

      <CardHeader className="gap-2 pb-3">
        <CardTitle className="line-clamp-1 text-[15px] leading-snug">
          {inspiration.title}
        </CardTitle>
        <p className="text-[13px] text-muted-foreground">{inspiration.company}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-4">
        <Badge variant="secondary" className="w-fit text-xs">
          {inspiration.industry}
        </Badge>

        <div className="flex flex-wrap gap-2">
          {inspiration.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border/60 bg-transparent pb-4">
        <a
          href={inspiration.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-w-0 flex-1"
          )}
        >
          Open
          <ExternalLinkIcon />
        </a>
        {showActions ? (
          <InspirationActionsMenu
            onEdit={() => onEdit(inspiration)}
            onDelete={() => onDelete(inspiration.id)}
          />
        ) : null}
      </CardFooter>
    </Card>
  );
}
