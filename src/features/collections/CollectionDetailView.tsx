"use client";

import { ArrowLeftIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { InspirationGrid } from "@/components/common/InspirationGrid";
import { InspirationGridSkeleton } from "@/components/common/InspirationGridSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { SortSelect } from "@/components/common/SortSelect";
import { Button, buttonVariants } from "@/components/ui/button";
import { AddToCollectionDialog } from "@/features/collections/AddToCollectionDialog";
import { CollectionFormDialog } from "@/features/collections/CollectionFormDialog";
import { InspirationFormDialog } from "@/features/inspiration/InspirationFormDialog";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import { useFavorites } from "@/hooks/use-favorites";
import {
  addInspirationToCollection,
  deleteCollection,
  getCollectionById,
  removeInspirationFromCollection,
  updateCollection,
} from "@/services/collection-service";
import {
  deleteInspiration,
  getInspirations,
  updateInspiration,
} from "@/services/inspiration-service";
import { type CollectionDetail, type CollectionFormValues } from "@/types/collection";
import { type Inspiration, type InspirationFormValues } from "@/types/inspiration";
import {
  INSPIRATION_SORT_OPTIONS,
  searchInspirations,
  sortInspirations,
  type InspirationSortOption,
} from "@/lib/inspiration-utils";
import { cn } from "@/lib/utils";

type CollectionDetailViewProps = {
  collectionId: string;
};

export function CollectionDetailView({ collectionId }: CollectionDetailViewProps) {
  const router = useRouter();
  const [collection, setCollection] = React.useState<CollectionDetail | null>(
    null
  );
  const [allInspirations, setAllInspirations] = React.useState<Inspiration[]>(
    []
  );
  const { favoriteIds, toggleFavorite, removeFavoriteById } = useFavorites();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingInspiration, setEditingInspiration] =
    React.useState<Inspiration | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<InspirationSortOption>("newest");

  const loadCollection = React.useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [collectionData, inspirationsData] = await Promise.all([
        getCollectionById(collectionId),
        getInspirations(),
      ]);
      setCollection(collectionData);
      setAllInspirations(inspirationsData);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load collection.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  React.useEffect(() => {
    void loadCollection();
  }, [loadCollection]);

  const collectionInspirationIds = React.useMemo(
    () => new Set(collection?.inspirations.map((item) => item.id) ?? []),
    [collection]
  );

  const availableInspirations = React.useMemo(
    () =>
      allInspirations.filter(
        (inspiration) => !collectionInspirationIds.has(inspiration.id)
      ),
    [allInspirations, collectionInspirationIds]
  );

  const handleAddInspiration = async (inspirationId: string) => {
    try {
      await addInspirationToCollection(collectionId, inspirationId);
      const inspiration = allInspirations.find(
        (item) => item.id === inspirationId
      );
      if (!inspiration || !collection) {
        return;
      }

      setCollection({
        ...collection,
        itemCount: collection.itemCount + 1,
        previewImageUrls: [
          inspiration.imageUrl,
          ...collection.previewImageUrls,
        ].slice(0, 3),
        inspirations: [inspiration, ...collection.inspirations],
      });
      showSuccess("Added to collection");
    } catch (error) {
      showError(
        "Could not add inspiration",
        getErrorMessage(error, "Something went wrong.")
      );
      throw error;
    }
  };

  const handleRemoveInspiration = async (inspirationId: string) => {
    try {
      await removeInspirationFromCollection(collectionId, inspirationId);
    setCollection((current) => {
      if (!current) {
        return current;
      }

      const inspirations = current.inspirations.filter(
        (item) => item.id !== inspirationId
      );

      return {
        ...current,
        itemCount: inspirations.length,
        inspirationIds: inspirations.map((item) => item.id),
        previewImageUrls: inspirations
          .map((item) => item.imageUrl)
          .slice(0, 3),
        inspirations,
      };
    });
      showSuccess("Removed from collection");
    } catch (error) {
      showError(
        "Could not remove inspiration",
        getErrorMessage(error, "Something went wrong.")
      );
    }
  };

  const handleEditInspiration = (inspiration: Inspiration) => {
    setEditingInspiration(inspiration);
  };

  const handleUpdateInspiration = async (values: InspirationFormValues) => {
    if (!editingInspiration) {
      return;
    }

    try {
      const updated = await updateInspiration(editingInspiration.id, values);
      setCollection((current) => {
        if (!current) {
          return current;
        }

        const inspirations = current.inspirations.map((item) =>
          item.id === updated.id ? updated : item
        );

        return {
          ...current,
          inspirations,
          previewImageUrls: inspirations
            .map((item) => item.imageUrl)
            .slice(0, 3),
        };
      });
      setAllInspirations((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setEditingInspiration(null);
      showSuccess("Inspiration updated");
    } catch (error) {
      showError(
        "Could not update inspiration",
        getErrorMessage(error, "Something went wrong.")
      );
      throw error;
    }
  };

  const handleDeleteInspiration = async (id: string) => {
    try {
      await deleteInspiration(id);
    await removeFavoriteById(id);
    setAllInspirations((current) => current.filter((item) => item.id !== id));
    setCollection((current) => {
      if (!current) {
        return current;
      }

      const inspirations = current.inspirations.filter((item) => item.id !== id);

      return {
        ...current,
        itemCount: inspirations.length,
        inspirationIds: inspirations.map((item) => item.id),
        previewImageUrls: inspirations
          .map((item) => item.imageUrl)
          .slice(0, 3),
        inspirations,
      };
    });
      showSuccess("Inspiration deleted");
    } catch (error) {
      showError(
        "Could not delete inspiration",
        getErrorMessage(error, "Something went wrong.")
      );
    }
  };

  const handleDeleteCollection = async () => {
    if (
      !window.confirm(
        "Delete this collection? Inspirations will remain in your library."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCollection(collectionId);
      showSuccess("Collection deleted");
      router.push("/collections");
    } catch (error) {
      showError(
        "Could not delete collection",
        getErrorMessage(error, "Something went wrong.")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateCollection = async (values: CollectionFormValues) => {
    try {
      const updated = await updateCollection(collectionId, values);
      setCollection((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          name: updated.name,
          description: updated.description,
        };
      });
      showSuccess("Collection updated");
    } catch (error) {
      showError(
        "Could not update collection",
        getErrorMessage(error, "Something went wrong.")
      );
      throw error;
    }
  };

  const displayedInspirations = React.useMemo(
    () =>
      sortInspirations(
        searchInspirations(collection?.inspirations ?? [], query),
        sort
      ),
    [collection?.inspirations, query, sort]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink />
        <InspirationGridSkeleton />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink />
        <EmptyState
          title="Collection not found"
          description={error ?? "This collection may have been deleted."}
          primaryAction={{
            label: "Back to Collections",
            href: "/collections",
          }}
          secondaryAction={{
            label: "Retry",
            onClick: () => void loadCollection(),
          }}
        />
      </div>
    );
  }

  const hasItems = collection.inspirations.length > 0;
  const hasDisplayedResults = displayedInspirations.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <BackLink />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title={collection.name}
          description={
            collection.description ??
            `${collection.itemCount} ${collection.itemCount === 1 ? "item" : "items"} in this collection.`
          }
        />
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilIcon />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => void handleDeleteCollection()}
          >
            <Trash2Icon />
            Delete
          </Button>
          <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
            <PlusIcon />
            Add Inspiration
          </Button>
        </div>
      </div>

      {!hasItems ? (
        <EmptyState
          title="This collection is empty."
          description="Add inspirations from your library to start curating."
          primaryAction={{
            label: "Add Inspiration",
            onClick: () => setIsAddDialogOpen(true),
          }}
          secondaryAction={{
            label: "Browse Inspiration",
            href: "/inspiration",
          }}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search in collection..."
              ariaLabel="Search in collection"
              className="sm:max-w-none sm:flex-1"
            />
            <SortSelect
              value={sort}
              options={INSPIRATION_SORT_OPTIONS}
              onChange={(value) => setSort(value as InspirationSortOption)}
              ariaLabel="Sort collection items"
            />
          </div>

          {hasDisplayedResults ? (
            <InspirationGrid
              inspirations={displayedInspirations}
              favoriteIds={favoriteIds}
              onFavoriteToggle={(id) => void toggleFavorite(id)}
              onRemove={handleRemoveInspiration}
              onEdit={handleEditInspiration}
              onDelete={(id) => void handleDeleteInspiration(id)}
            />
          ) : (
            <EmptyState
              title="No results found"
              description="Try a different search term or sort order."
              primaryAction={{
                label: "Clear search",
                onClick: () => setQuery(""),
              }}
            />
          )}
        </>
      )}

      <AddToCollectionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        availableInspirations={availableInspirations}
        onAdd={handleAddInspiration}
      />

      <CollectionFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        collection={collection}
        onSubmit={handleUpdateCollection}
      />

      <InspirationFormDialog
        open={Boolean(editingInspiration)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingInspiration(null);
          }
        }}
        mode="edit"
        inspiration={editingInspiration ?? undefined}
        onSubmit={handleUpdateInspiration}
      />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/collections"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "w-fit text-muted-foreground"
      )}
    >
      <ArrowLeftIcon />
      Collections
    </Link>
  );
}
