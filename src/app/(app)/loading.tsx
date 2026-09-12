export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl bg-muted ring-1 ring-border/60"
          />
        ))}
      </div>
    </div>
  );
}
