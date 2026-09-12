"use client";

import { cn } from "@/lib/utils";

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

type FilterBarProps = {
  filters: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
};

export function FilterBar({
  filters,
  activeFilter = filters[0]?.value,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = filter.value === activeFilter;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange?.(filter.value)}
            className={cn(
              "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
              isActive
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>{filter.label}</span>
            {filter.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {filter.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
