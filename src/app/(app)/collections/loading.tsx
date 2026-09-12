import { CollectionsGridSkeleton } from "@/components/common/CollectionsGridSkeleton";

export default function CollectionsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
      </div>
      <CollectionsGridSkeleton />
    </div>
  );
}
