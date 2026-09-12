import { Card } from "@/components/ui/card";

const SKELETON_COUNT = 6;

export function InspirationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Card key={index} className="overflow-hidden py-0 ring-border/60">
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-8 w-full animate-pulse rounded-lg bg-muted pt-2" />
          </div>
        </Card>
      ))}
    </div>
  );
}
