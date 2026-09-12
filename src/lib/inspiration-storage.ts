const FAVORITES_STORAGE_KEY = "design-os-favorites";

export function readLegacyFavoriteIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) {
      return new Set();
    }

    const parsed: unknown = JSON.parse(stored);
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

export function clearLegacyFavoriteIds() {
  window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
}
