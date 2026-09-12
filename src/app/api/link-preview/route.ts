import { NextResponse } from "next/server";

import { extractPreviewImageUrl, LINK_PREVIEW_TIMEOUT_MS } from "@/lib/link-preview";

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !isValidHttpUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DesignOS/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(LINK_PREVIEW_TIMEOUT_MS),
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const html = await response.text();
    const imageUrl = extractPreviewImageUrl(url, html);

    return NextResponse.json({ imageUrl });
  } catch {
    return NextResponse.json({ imageUrl: null });
  }
}
