"use client";

import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { FilterBar } from "@/components/common/FilterBar";
import { InspirationGrid } from "@/components/common/InspirationGrid";
import { InspirationGridSkeleton } from "@/components/common/InspirationGridSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { SortSelect } from "@/components/common/SortSelect";
import { Button } from "@/components/ui/button";
import { AddInspirationDialog } from "@/features/inspiration/AddInspirationDialog";
import { InspirationFormDialog } from "@/features/inspiration/InspirationFormDialog";
import {
  addInspirationToCollectionState,
  buildCollectionMembershipMap,
  removeInspirationFromAllCollectionsState,
} from "@/lib/collection-utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import {
  ALL_INDUSTRY_FILTER,
  buildIndustryFilterOptions,
  filterInspirations,
  INSPIRATION_SORT_OPTIONS,
  sortInspirations,
  type InspirationSortOption,
} from "@/lib/inspiration-utils";
import { useFavorites } from "@/hooks/use-favorites";
import {
  createInspiration,
  deleteInspiration,
  getInspirations,
  updateInspiration,
} from "@/services/inspiration-service";
import { getCollections } from "@/services/collection-service";
import { type Collection } from "@/types/collection";
import { type Inspiration, type InspirationFormValues } from "@/types/inspiration";

export function InspirationLibrary() {
  const searchParams = useSearchParams();
  const [items, setItems] = React.useState<Awaited<ReturnType<typeof getInspirations>>>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [membershipByInspiration, setMembershipByInspiration] = React.useState<
    Map<string, Set<string>>
  >(new Map());
  const [query, setQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState(ALL_INDUSTRY_FILTER);
  const [sort, setSort] = React.useState<InspirationSortOption>("newest");
  const { favoriteIds, toggleFavorite, removeFavoriteById } = useFavorites();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingInspiration, setEditingInspiration] =
    React.useState<Inspiration | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadInspirations = React.useCallback(async () => {
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
      const data = await getInspirations();
      setItems(data);

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
      const rawMessage =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load inspirations.";
      const message =
        rawMessage === "TypeError: Failed to fetch" ||
        rawMessage === "Failed to fetch"
          ? "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local — copy the exact Project URL from Supabase Dashboard → Connect, then restart npm run dev."
          : rawMessage;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadInspirations();
  }, [loadInspirations]);

  React.useEffect(() => {
    if (searchParams.get("add") === "1") {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const industryFilters = React.useMemo(
    () => buildIndustryFilterOptions(items),
    [items]
  );

  React.useEffect(() => {
    if (!industryFilters.some((filter) => filter.value === activeFilter)) {
      setActiveFilter(ALL_INDUSTRY_FILTER);
    }
  }, [industryFilters, activeFilter]);

  const filteredItems = React.useMemo(
    () => sortInspirations(filterInspirations(items, query, activeFilter), sort),
    [items, query, activeFilter, sort]
  );

  const hasItems = items.length > 0;
  const hasFilteredResults = filteredItems.length > 0;

  const handleAddInspiration = async (values: InspirationFormValues) => {
    try {
      const created = await createInspiration(values);
      setItems((current) => [created, ...current]);
      showSuccess("Inspiration added");
    } catch (error) {
      showError(
        "Could not add inspiration",
        getErrorMessage(error, "Something went wrong.")
      );
      throw error;
    }
  };

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

  const openAddDialog = () => setIsDialogOpen(true);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Inspiration Library"
          description="Browse and save design references for your team."
        />
        <InspirationGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Inspiration Library"
          description="Browse and save design references for your team."
        />
        <EmptyState
          title="Unable to connect to Supabase"
          description={error}
          primaryAction={{
            label: "Retry",
            onClick: () => void loadInspirations(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Inspiration Library"
          description="Browse and save design references for your team."
        />
        <Button onClick={openAddDialog} type="button" className="shrink-0">
          <PlusIcon />
          Add Inspiration
        </Button>
      </div>

      {hasItems ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              value={query}
              onChange={setQuery}
              className="sm:flex-1"
            />
            <SortSelect
              value={sort}
              options={INSPIRATION_SORT_OPTIONS}
              onChange={(value) => setSort(value as InspirationSortOption)}
              ariaLabel="Sort inspirations"
            />
          </div>
          <FilterBar
            filters={industryFilters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      ) : null}

      {!hasItems ? (
        <EmptyState
          title="No inspirations yet."
          description="Start building your design knowledge base."
          primaryAction={{
            label: "Add Inspiration",
            onClick: openAddDialog,
          }}
        />
      ) : hasFilteredResults ? (
        <InspirationGrid
          inspirations={filteredItems}
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
          title="No results found"
          description="Try a different search term or filter."
          primaryAction={{
            label: "Clear filters",
            onClick: () => {
              setQuery("");
              setActiveFilter(ALL_INDUSTRY_FILTER);
            },
          }}
          secondaryAction={{
            label: "Add Inspiration",
            onClick: openAddDialog,
          }}
        />
      )}

      <AddInspirationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddInspiration}
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
