import { CollectionCard } from "@/components/common/CollectionCard";
import { type Collection } from "@/types/collection";

type CollectionsGridProps = {
  collections: Collection[];
  onEdit?: (collection: Collection) => void;
  onDelete?: (id: string) => void;
};

export function CollectionsGrid({
  collections,
  onEdit,
  onDelete,
}: CollectionsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
