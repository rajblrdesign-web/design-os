"use client";

import { CheckIcon, FolderPlusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import { addInspirationToCollection } from "@/services/collection-service";
import { type Collection } from "@/types/collection";

type AddToCollectionMenuProps = {
  inspirationId: string;
  collections: Collection[];
  memberCollectionIds: Set<string>;
  onAdded: (collectionId: string) => void;
  className?: string;
};

export function AddToCollectionMenu({
  inspirationId,
  collections,
  memberCollectionIds,
  onAdded,
  className,
}: AddToCollectionMenuProps) {
  const [addingCollectionId, setAddingCollectionId] = React.useState<
    string | null
  >(null);
  const handleAdd = async (collectionId: string) => {
    if (memberCollectionIds.has(collectionId)) {
      return;
    }

    const collection = collections.find((item) => item.id === collectionId);
    setAddingCollectionId(collectionId);

    try {
      await addInspirationToCollection(collectionId, inspirationId);
      onAdded(collectionId);
      showSuccess(
        collection ? `Added to ${collection.name}` : "Added to collection"
      );
    } catch (error) {
      showError(
        "Could not add to collection",
        getErrorMessage(error, "Something went wrong.")
      );
    } finally {
      setAddingCollectionId(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Add to collection"
            className={cn(
              "bg-background/80 text-muted-foreground backdrop-blur-sm hover:bg-background hover:text-foreground",
              className
            )}
          />
        }
      >
        <FolderPlusIcon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Add to collection</DropdownMenuLabel>

          {collections.length === 0 ? (
            <DropdownMenuItem
              render={
                <Link
                  href="/collections?add=1"
                  className="flex items-center gap-2"
                />
              }
            >
              <PlusIcon />
              Create collection
            </DropdownMenuItem>
          ) : (
            collections.map((collection) => {
              const isMember = memberCollectionIds.has(collection.id);
              const isAdding = addingCollectionId === collection.id;

              return (
                <DropdownMenuItem
                  key={collection.id}
                  disabled={isMember || isAdding}
                  onClick={() => void handleAdd(collection.id)}
                >
                  <span className="truncate">{collection.name}</span>
                  {isMember ? (
                    <CheckIcon className="ml-auto size-4 text-muted-foreground" />
                  ) : isAdding ? (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Adding...
                    </span>
                  ) : null}
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuGroup>

        {collections.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <Link
                    href="/collections?add=1"
                    className="flex items-center gap-2"
                  />
                }
              >
                <PlusIcon />
                New collection
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : null}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
