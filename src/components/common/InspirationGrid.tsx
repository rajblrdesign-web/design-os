import { InspirationCard } from "@/components/common/InspirationCard";
import { type Collection } from "@/types/collection";
import { type Inspiration } from "@/types/inspiration";

type InspirationGridProps = {
  inspirations: Inspiration[];
  favoriteIds?: Set<string>;
  onFavoriteToggle?: (id: string) => void;
  onRemove?: (id: string) => void;
  collections?: Collection[];
  membershipByInspiration?: Map<string, Set<string>>;
  onAddedToCollection?: (inspirationId: string, collectionId: string) => void;
  onEdit?: (inspiration: Inspiration) => void;
  onDelete?: (id: string) => void;
};

export function InspirationGrid({
  inspirations,
  favoriteIds,
  onFavoriteToggle,
  onRemove,
  collections,
  membershipByInspiration,
  onAddedToCollection,
  onEdit,
  onDelete,
}: InspirationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {inspirations.map((inspiration) => (
        <InspirationCard
          key={inspiration.id}
          inspiration={inspiration}
          isFavorite={favoriteIds?.has(inspiration.id)}
          onFavoriteToggle={onFavoriteToggle}
          onRemove={onRemove}
          collections={collections}
          memberCollectionIds={
            membershipByInspiration
              ? membershipByInspiration.get(inspiration.id) ?? new Set()
              : undefined
          }
          onAddedToCollection={
            onAddedToCollection
              ? (collectionId) =>
                  onAddedToCollection(inspiration.id, collectionId)
              : undefined
          }
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
