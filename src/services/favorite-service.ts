import { getClientId } from "@/lib/client-id";
import {
  clearLegacyFavoriteIds,
  readLegacyFavoriteIds,
} from "@/lib/inspiration-storage";
import { createClient } from "@/lib/supabase/client";

const MIGRATION_FLAG_KEY = "design-os-favorites-migrated";

function getScopedClientId(): string {
  const clientId = getClientId();

  if (!clientId) {
    throw new Error("Unable to identify this browser session.");
  }

  return clientId;
}

export async function migrateLocalFavoritesIfNeeded(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (window.localStorage.getItem(MIGRATION_FLAG_KEY) === "1") {
    return;
  }

  const legacyFavoriteIds = readLegacyFavoriteIds();

  if (legacyFavoriteIds.size === 0) {
    window.localStorage.setItem(MIGRATION_FLAG_KEY, "1");
    return;
  }

  const supabase = createClient();
  const clientId = getScopedClientId();

  const rows = Array.from(legacyFavoriteIds).map((inspirationId) => ({
    client_id: clientId,
    inspiration_id: inspirationId,
  }));

  const { error } = await supabase
    .from("favorites")
    .upsert(rows, { onConflict: "client_id,inspiration_id" });

  if (error) {
    throw new Error(error.message);
  }

  clearLegacyFavoriteIds();
  window.localStorage.setItem(MIGRATION_FLAG_KEY, "1");
}

export async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = createClient();
  const clientId = getScopedClientId();

  const { data, error } = await supabase
    .from("favorites")
    .select("inspiration_id")
    .eq("client_id", clientId);

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((row) => row.inspiration_id));
}

export async function addFavorite(inspirationId: string): Promise<void> {
  const supabase = createClient();
  const clientId = getScopedClientId();

  const { error } = await supabase.from("favorites").insert({
    client_id: clientId,
    inspiration_id: inspirationId,
  });

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function removeFavorite(inspirationId: string): Promise<void> {
  const supabase = createClient();
  const clientId = getScopedClientId();

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("client_id", clientId)
    .eq("inspiration_id", inspirationId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function clearFavorites(): Promise<void> {
  const supabase = createClient();
  const clientId = getScopedClientId();

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("client_id", clientId);

  if (error) {
    throw new Error(error.message);
  }
}
