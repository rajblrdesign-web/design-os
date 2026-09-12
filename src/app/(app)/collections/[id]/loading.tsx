import { InspirationGridSkeleton } from "@/components/common/InspirationGridSkeleton";

export default function CollectionDetailLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      <InspirationGridSkeleton />
    </div>
  );
}
