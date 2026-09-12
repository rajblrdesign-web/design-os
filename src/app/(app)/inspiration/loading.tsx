import { FilterBar } from "@/components/common/FilterBar";
import { InspirationGridSkeleton } from "@/components/common/InspirationGridSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { ALL_INDUSTRY_FILTER } from "@/lib/inspiration-utils";

export default function InspirationLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Inspiration Library"
        description="Browse and save design references for your team."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <FilterBar
          filters={[{ value: ALL_INDUSTRY_FILTER, label: ALL_INDUSTRY_FILTER }]}
        />
      </div>

      <InspirationGridSkeleton />
    </div>
  );
}
