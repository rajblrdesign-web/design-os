"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  placeholder?: string;
  ariaLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SearchBar({
  placeholder = "Search inspiration...",
  ariaLabel,
  value = "",
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="h-9 bg-muted/30 pl-9"
      />
    </div>
  );
}
