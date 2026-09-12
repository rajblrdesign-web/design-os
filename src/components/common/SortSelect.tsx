"use client";

import { ArrowUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SortSelectOption = {
  value: string;
  label: string;
};

type SortSelectProps = {
  value: string;
  options: SortSelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
};

export function SortSelect({
  value,
  options,
  onChange,
  ariaLabel = "Sort",
  className,
}: SortSelectProps) {
  return (
    <div className={cn("relative w-full sm:w-44", className)}>
      <ArrowUpDownIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-input bg-muted/30 py-1 pr-8 pl-9 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
