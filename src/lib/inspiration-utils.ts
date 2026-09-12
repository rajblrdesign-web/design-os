import { type Inspiration, type InspirationFormValues } from "@/types/inspiration";

export const ALL_INDUSTRY_FILTER = "All";

export type IndustryFilterOption = {
  value: string;
  label: string;
  count: number;
};

export function buildIndustryFilterOptions(
  inspirations: Inspiration[]
): IndustryFilterOption[] {
  const counts = new Map<string, number>();

  for (const inspiration of inspirations) {
    const industry = inspiration.industry.trim();
    if (industry) {
      counts.set(industry, (counts.get(industry) ?? 0) + 1);
    }
  }

  return [
    {
      value: ALL_INDUSTRY_FILTER,
      label: ALL_INDUSTRY_FILTER,
      count: inspirations.length,
    },
    ...Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([industry, count]) => ({
        value: industry,
        label: industry,
        count,
      })),
  ];
}

export type InspirationSortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "company-asc";

export const INSPIRATION_SORT_OPTIONS: Array<{
  value: InspirationSortOption;
  label: string;
}> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "company-asc", label: "Company A–Z" },
];

export function getInspirationSearchText(inspiration: Inspiration): string {
  return [
    inspiration.title,
    inspiration.company,
    inspiration.industry,
    ...inspiration.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export function searchInspirations(
  inspirations: Inspiration[],
  query: string
): Inspiration[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return inspirations;
  }

  return inspirations.filter((inspiration) =>
    getInspirationSearchText(inspiration).includes(normalizedQuery)
  );
}

export function filterInspirations(
  inspirations: Inspiration[],
  query: string,
  activeFilter: string
): Inspiration[] {
  const filteredByIndustry =
    activeFilter === ALL_INDUSTRY_FILTER
      ? inspirations
      : inspirations.filter(
          (inspiration) => inspiration.industry === activeFilter
        );

  return searchInspirations(filteredByIndustry, query);
}

export function sortInspirations(
  inspirations: Inspiration[],
  sort: InspirationSortOption
): Inspiration[] {
  const sorted = [...inspirations];

  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "company-asc":
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function createInspirationId(): string {
  return crypto.randomUUID();
}

export function parseTagsInput(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(", ");
}

export function inspirationToFormValues(
  inspiration: Inspiration
): InspirationFormValues {
  return {
    title: inspiration.title,
    company: inspiration.company,
    industry: inspiration.industry,
    imageUrl: inspiration.imageUrl,
    url: inspiration.url,
    tags: formatTagsForInput(inspiration.tags),
  };
}

const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|svg|webp)(\?|$)/i;

const IMAGE_HOST_PATTERNS = [
  /images\.unsplash\.com/i,
  /i\.imgur\.com/i,
  /cdn\./i,
  /\/image\//i,
  /\/images\//i,
  /\/photo\//i,
  /\/media\//i,
  /\/uploads\//i,
];

export function isLikelyImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    const path = parsed.pathname + parsed.search;
    if (path === "/" || path === "") {
      return false;
    }

    return (
      IMAGE_EXTENSION.test(path) ||
      IMAGE_HOST_PATTERNS.some((pattern) => pattern.test(url))
    );
  } catch {
    return false;
  }
}
