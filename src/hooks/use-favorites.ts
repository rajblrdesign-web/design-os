"use client";

import * as React from "react";

import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, showError } from "@/lib/toast";
import {
  addFavorite,
  clearFavorites,
  getFavoriteIds,
  migrateLocalFavoritesIfNeeded,
  removeFavorite,
} from "@/services/favorite-service";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshFavorites = React.useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setFavoriteIds(new Set());
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await migrateLocalFavoritesIfNeeded();
      const ids = await getFavoriteIds();
      setFavoriteIds(ids);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load favorites.";
      setError(message);
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = React.useCallback(
    async (inspirationId: string) => {
      const wasFavorite = favoriteIds.has(inspirationId);

      setFavoriteIds((current) => {
        const next = new Set(current);
        if (wasFavorite) {
          next.delete(inspirationId);
        } else {
          next.add(inspirationId);
        }
        return next;
      });

      try {
        if (wasFavorite) {
          await removeFavorite(inspirationId);
        } else {
          await addFavorite(inspirationId);
        }
      } catch (error) {
        showError(
          "Could not update favorite",
          getErrorMessage(error, "Something went wrong.")
        );
        await refreshFavorites();
      }
    },
    [favoriteIds, refreshFavorites]
  );

  const removeFavoriteById = React.useCallback(
    async (inspirationId: string) => {
      if (!favoriteIds.has(inspirationId)) {
        return;
      }

      setFavoriteIds((current) => {
        const next = new Set(current);
        next.delete(inspirationId);
        return next;
      });

      try {
        await removeFavorite(inspirationId);
      } catch {
        await refreshFavorites();
      }
    },
    [favoriteIds, refreshFavorites]
  );

  const clearAllFavorites = React.useCallback(async () => {
    setFavoriteIds(new Set());

    try {
      await clearFavorites();
    } catch {
      await refreshFavorites();
    }
  }, [refreshFavorites]);

  return {
    favoriteIds,
    favoriteCount: favoriteIds.size,
    isLoading,
    error,
    toggleFavorite,
    removeFavoriteById,
    clearAllFavorites,
    refreshFavorites,
  };
}
