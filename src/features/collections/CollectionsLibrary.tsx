"use client";

import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { CollectionsGrid } from "@/components/common/CollectionsGrid";
import { CollectionsGridSkeleton } from "@/components/common/CollectionsGridSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { SortSelect } from "@/components/common/SortSelect";
import { Button } from "@/components/ui/button";
import { AddCollectionDialog } from "@/features/collections/AddCollectionDialog";
import { CollectionFormDialog } from "@/features/collections/CollectionFormDialog";
import {
  COLLECTION_SORT_OPTIONS,
  filterCollections,
  sortCollections,
  type CollectionSortOption,
} from "@/lib/collection-utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from "@/services/collection-service";
import {
  type Collection,
  type CollectionFormValues,
} from "@/types/collection";

export function CollectionsLibrary() {
  const searchParams = useSearchParams();
  const [collections, setCollections] = React.useState<
    Awaited<ReturnType<typeof getCollections>>
  >([]);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<CollectionSortOption>("newest");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCollection, setEditingCollection] =
    React.useState<Collection | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadCollections = React.useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Copy .env.local.example to .env.local and add your project credentials."
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCollections();
      setCollections(data);
    } catch (loadError) {
      const rawMessage =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load collections.";
      const message =
        rawMessage.includes("collections") &&
        rawMessage.toLowerCase().includes("does not exist")
          ? "Collections tables are missing. Run supabase/migrations/002_collections.sql in the Supabase SQL Editor."
          : rawMessage === "TypeError: Failed to fetch" ||
              rawMessage === "Failed to fetch"
            ? "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local, then restart npm run dev."
            : rawMessage;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCollections();
  }, [loadCollections]);

  React.useEffect(() => {
    if (searchParams.get("add") === "1") {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const handleCreateCollection = async (values: CollectionFormValues) => {
    try {
      const created = await createCollection(values);
      setCollections((current) => [created, ...current]);
      showSuccess("Collection created");
    } catch (error) {
      showError(
        "Could not create collection",
        getErrorMessage(error, "Something went wrong.")
      );
      throw error;
    }
  };

  const handleUpdateCollection = async (values: CollectionFormValues) => {
    if (!editingCollection) {
      return;
    }

    try {
      const updated = await updateCollection(editingCollection.id, values);
      setCollections((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item
        )
      );
      setEditingCollection(null);
      showSuccess("Collection updated");
    } catch (error) {
      showError(
        "Could not update collection",
        getErrorMessage(error, "Something went wrong.")
      );
      throw error;
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollection(id);
      setCollections((current) => current.filter((item) => item.id !== id));
      showSuccess("Collection deleted");
    } catch (error) {
      showError(
        "Could not delete collection",
        getErrorMessage(error, "Something went wrong.")
      );
    }
  };

  const filteredCollections = React.useMemo(
    () => sortCollections(filterCollections(collections, query), sort),
    [collections, query, sort]
  );

  const hasFilteredResults = filteredCollections.length > 0;

  const openCreateDialog = () => setIsDialogOpen(true);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Collections"
          description="Organize your inspiration into curated groups."
        />
        <CollectionsGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Collections"
          description="Organize your inspiration into curated groups."
        />
        <EmptyState
          title="Unable to load collections"
          description={error}
          primaryAction={{
            label: "Retry",
            onClick: () => void loadCollections(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Collections"
          description="Organize your inspiration into curated groups."
        />
        <Button onClick={openCreateDialog} type="button" className="shrink-0">
          <PlusIcon />
          Create Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          title="No collections yet."
          description="Create your first collection to group related inspirations."
          primaryAction={{
            label: "Create Collection",
            onClick: openCreateDialog,
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
              placeholder="Search collections..."
              ariaLabel="Search collections"
              className="sm:max-w-none sm:flex-1"
            />
            <SortSelect
              value={sort}
              options={COLLECTION_SORT_OPTIONS}
              onChange={(value) => setSort(value as CollectionSortOption)}
              ariaLabel="Sort collections"
            />
          </div>

          {hasFilteredResults ? (
            <CollectionsGrid
              collections={filteredCollections}
              onEdit={setEditingCollection}
              onDelete={(id) => void handleDeleteCollection(id)}
            />
          ) : (
            <EmptyState
              title="No results found"
              description="Try a different search term."
              primaryAction={{
                label: "Clear search",
                onClick: () => setQuery(""),
              }}
            />
          )}
        </>
      )}

      <AddCollectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateCollection}
      />

      <CollectionFormDialog
        open={Boolean(editingCollection)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCollection(null);
          }
        }}
        mode="edit"
        collection={editingCollection ?? undefined}
        onSubmit={handleUpdateCollection}
      />
    </div>
  );
}
