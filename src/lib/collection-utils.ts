import {
  type Collection,
  type CollectionFormValues,
} from "@/types/collection";

export function collectionToFormValues(
  collection: Pick<Collection, "name" | "description">
): CollectionFormValues {
  return {
    name: collection.name,
    description: collection.description ?? "",
  };
}

export type CollectionSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "items-desc";

export const COLLECTION_SORT_OPTIONS: Array<{
  value: CollectionSortOption;
  label: string;
}> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "items-desc", label: "Most items" },
];

export function sortCollections(
  collections: Collection[],
  sort: CollectionSortOption
): Collection[] {
  const sorted = [...collections];

  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "items-desc":
      return sorted.sort((a, b) => b.itemCount - a.itemCount);
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function filterCollections(
  collections: Collection[],
  query: string
): Collection[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return collections;
  }

  return collections.filter((collection) => {
    const searchableText = [collection.name, collection.description ?? ""]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function buildCollectionMembershipMap(
  collections: Collection[]
): Map<string, Set<string>> {
  const membership = new Map<string, Set<string>>();

  for (const collection of collections) {
    for (const inspirationId of collection.inspirationIds) {
      const existing = membership.get(inspirationId) ?? new Set<string>();
      existing.add(collection.id);
      membership.set(inspirationId, existing);
    }
  }

  return membership;
}

export function addInspirationToCollectionState(
  collections: Collection[],
  collectionId: string,
  inspirationId: string
): Collection[] {
  return collections.map((collection) => {
    if (collection.id !== collectionId) {
      return collection;
    }

    if (collection.inspirationIds.includes(inspirationId)) {
      return collection;
    }

    return {
      ...collection,
      itemCount: collection.itemCount + 1,
      inspirationIds: [...collection.inspirationIds, inspirationId],
    };
  });
}

export function removeInspirationFromAllCollectionsState(
  collections: Collection[],
  inspirationId: string
): Collection[] {
  return collections.map((collection) => {
    if (!collection.inspirationIds.includes(inspirationId)) {
      return collection;
    }

    const inspirationIds = collection.inspirationIds.filter(
      (id) => id !== inspirationId
    );

    return {
      ...collection,
      itemCount: inspirationIds.length,
      inspirationIds,
      previewImageUrls: [],
    };
  });
}
