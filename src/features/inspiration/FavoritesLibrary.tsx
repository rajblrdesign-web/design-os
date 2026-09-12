"use client";

import * as React from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { InspirationGrid } from "@/components/common/InspirationGrid";
import { InspirationGridSkeleton } from "@/components/common/InspirationGridSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { InspirationFormDialog } from "@/features/inspiration/InspirationFormDialog";
import {
  addInspirationToCollectionState,
  buildCollectionMembershipMap,
  removeInspirationFromAllCollectionsState,
} from "@/lib/collection-utils";
import { useFavorites } from "@/hooks/use-favorites";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import {
  deleteInspiration,
  getInspirations,
  updateInspiration,
} from "@/services/inspiration-service";
import { getCollections } from "@/services/collection-service";
import { type Collection } from "@/types/collection";
import { type Inspiration, type InspirationFormValues } from "@/types/inspiration";

export function FavoritesLibrary() {
  const [items, setItems] = React.useState<Inspiration[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [membershipByInspiration, setMembershipByInspiration] = React.useState<
    Map<string, Set<string>>
  >(new Map());
  const {
    favoriteIds,
    toggleFavorite,
    removeFavoriteById,
    error: favoritesError,
  } = useFavorites();
  const [editingInspiration, setEditingInspiration] =
    React.useState<Inspiration | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
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
      const inspirations = await getInspirations();
      setItems(inspirations);

      try {
        const collectionsData = await getCollections();
        setCollections(collectionsData);
        setMembershipByInspiration(
          buildCollectionMembershipMap(collectionsData)
        );
      } catch {
        setCollections([]);
        setMembershipByInspiration(new Map());
      }
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load favorites.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const favoriteItems = React.useMemo(
    () => items.filter((item) => favoriteIds.has(item.id)),
    [items, favoriteIds]
  );

  const handleAddedToCollection = (
    inspirationId: string,
    collectionId: string
  ) => {
    setCollections((current) =>
      addInspirationToCollectionState(current, collectionId, inspirationId)
    );
    setMembershipByInspiration((current) => {
      const next = new Map(current);
      const existing = new Set(next.get(inspirationId) ?? []);
      existing.add(collectionId);
      next.set(inspirationId, existing);
      return next;
    });
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
      setItems((current) =>
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
    setItems((current) => current.filter((item) => item.id !== id));
    await removeFavoriteById(id);
    setCollections((current) =>
      removeInspirationFromAllCollectionsState(current, id)
    );
    setMembershipByInspiration((current) => {
      const next = new Map(current);
      next.delete(id);
      return next;
    });
      showSuccess("Inspiration deleted");
    } catch (error) {
      showError(
        "Could not delete inspiration",
        getErrorMessage(error, "Something went wrong.")
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Favorites"
          description="Your saved design references in one place."
        />
        <InspirationGridSkeleton />
      </div>
    );
  }

  const displayError = error ?? favoritesError;

  if (displayError) {
    const favoritesTableMissing =
      displayError.toLowerCase().includes("favorites") &&
      displayError.toLowerCase().includes("does not exist");

    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Favorites"
          description="Your saved design references in one place."
        />
        <EmptyState
          title="Unable to load favorites"
          description={
            favoritesTableMissing
              ? "Favorites table is missing. Run supabase/migrations/004_favorites.sql in the Supabase SQL Editor."
              : displayError
          }
          primaryAction={{
            label: "Retry",
            onClick: () => void loadData(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Favorites"
        description="Your saved design references in one place."
      />

      {favoriteItems.length > 0 ? (
        <InspirationGrid
          inspirations={favoriteItems}
          favoriteIds={favoriteIds}
          onFavoriteToggle={(id) => void toggleFavorite(id)}
          collections={collections}
          membershipByInspiration={membershipByInspiration}
          onAddedToCollection={handleAddedToCollection}
          onEdit={handleEditInspiration}
          onDelete={(id) => void handleDeleteInspiration(id)}
        />
      ) : (
        <EmptyState
          title="No favorites yet"
          description="Heart an inspiration in your library to save it here."
        />
      )}

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
