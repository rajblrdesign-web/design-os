export const LINK_PREVIEW_TIMEOUT_MS = 6000;

export const DEFAULT_INSPIRATION_IMAGE =
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop";

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveImageUrl(baseUrl: string, imageUrl: string): string {
  try {
    return new URL(imageUrl, baseUrl).href;
  } catch {
    return imageUrl;
  }
}

function extractMetaContent(html: string, key: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

export function extractPreviewImageUrl(
  pageUrl: string,
  html: string
): string | null {
  const imageUrl =
    extractMetaContent(html, "og:image") ||
    extractMetaContent(html, "twitter:image") ||
    extractMetaContent(html, "twitter:image:src");

  if (!imageUrl || !isValidHttpUrl(resolveImageUrl(pageUrl, imageUrl))) {
    return null;
  }

  return resolveImageUrl(pageUrl, imageUrl);
}

export async function fetchLinkPreviewImage(
  url: string,
  timeoutMs = LINK_PREVIEW_TIMEOUT_MS
): Promise<string | null> {
  const trimmedUrl = url.trim();

  if (!isValidHttpUrl(trimmedUrl)) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `/api/link-preview?url=${encodeURIComponent(trimmedUrl)}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { imageUrl?: string | null };
    return data.imageUrl ?? null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function resolveInspirationImageUrl(
  linkUrl: string,
  existingImageUrl?: string
): Promise<string> {
  const trimmedExisting = existingImageUrl?.trim();

  if (trimmedExisting && trimmedExisting !== DEFAULT_INSPIRATION_IMAGE) {
    return trimmedExisting;
  }

  const preview = await fetchLinkPreviewImage(linkUrl);
  return preview ?? trimmedExisting ?? DEFAULT_INSPIRATION_IMAGE;
}
