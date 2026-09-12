"use client";

import {
  FolderIcon,
  HeartIcon,
  LightbulbIcon,
  PlusIcon,
} from "lucide-react";
import * as React from "react";

import { CollectionCard } from "@/components/common/CollectionCard";
import {
  QuickAction,
  SectionHeader,
} from "@/components/common/DashboardSection";
import { EmptyState } from "@/components/common/EmptyState";
import { InspirationGrid } from "@/components/common/InspirationGrid";
import { InspirationGridSkeleton } from "@/components/common/InspirationGridSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useFavorites } from "@/hooks/use-favorites";
import { readWorkspaceName } from "@/lib/settings-storage";
import { getCollections } from "@/services/collection-service";
import { getInspirations } from "@/services/inspiration-service";
import { type Collection } from "@/types/collection";
import { type Inspiration } from "@/types/inspiration";

const RECENT_LIMIT = 3;

export function WorkspaceDashboard() {
  const [inspirations, setInspirations] = React.useState<Inspiration[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const { favoriteCount } = useFavorites();
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboard = React.useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Copy .env.local.example to .env.local and add your project credentials."
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const inspirationsData = await getInspirations();
      setInspirations(inspirationsData);

      try {
        const collectionsData = await getCollections();
        setCollections(collectionsData);
      } catch {
        setCollections([]);
      }
    } catch (loadError) {
      const rawMessage =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load workspace.";
      const message =
        rawMessage === "TypeError: Failed to fetch" ||
        rawMessage === "Failed to fetch"
          ? "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL in .env.local, then restart npm run dev."
          : rawMessage;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setWorkspaceName(readWorkspaceName());
    void loadDashboard();
  }, [loadDashboard]);

  const dashboardTitle = workspaceName || "Workspace";
  const dashboardDescription = workspaceName
    ? `Overview of ${workspaceName}.`
    : "Overview of your design library.";

  const recentInspirations = inspirations.slice(0, RECENT_LIMIT);
  const recentCollections = collections.slice(0, RECENT_LIMIT);
  const hasContent = inspirations.length > 0 || collections.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <PageHeader
          title={dashboardTitle}
          description={dashboardDescription}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-muted ring-1 ring-border/60"
            />
          ))}
        </div>
        <InspirationGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <PageHeader
          title={dashboardTitle}
          description={dashboardDescription}
        />
        <EmptyState
          title="Unable to load workspace"
          description={error}
          primaryAction={{
            label: "Retry",
            onClick: () => void loadDashboard(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title={dashboardTitle}
        description={dashboardDescription}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Inspirations"
          value={inspirations.length}
          href="/inspiration"
        />
        <StatCard
          label="Collections"
          value={collections.length}
          href="/collections"
        />
        <StatCard label="Favorites" value={favoriteCount} href="/favorites" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickAction
          label="Add Inspiration"
          description="Save a new design reference."
          href="/inspiration?add=1"
          icon={PlusIcon}
        />
        <QuickAction
          label="Create Collection"
          description="Group related inspirations."
          href="/collections?add=1"
          icon={FolderIcon}
        />
        <QuickAction
          label="Browse Library"
          description="Explore your saved references."
          href="/inspiration"
          icon={LightbulbIcon}
        />
      </section>

      {!hasContent ? (
        <EmptyState
          title="Welcome to Design OS"
          description="Start building your inspiration library."
          primaryAction={{
            label: "Add Inspiration",
            href: "/inspiration?add=1",
          }}
          secondaryAction={{
            label: "Browse Inspiration",
            href: "/inspiration",
          }}
        />
      ) : (
        <>
          {recentInspirations.length > 0 ? (
            <section className="flex flex-col gap-6">
              <SectionHeader title="Recent inspirations" href="/inspiration" />
              <InspirationGrid inspirations={recentInspirations} />
            </section>
          ) : null}

          {recentCollections.length > 0 ? (
            <section className="flex flex-col gap-6">
              <SectionHeader title="Collections" href="/collections" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </section>
          ) : collections.length === 0 && inspirations.length > 0 ? (
            <section className="flex flex-col gap-6">
              <SectionHeader title="Collections" href="/collections" />
              <EmptyState
                title="No collections yet"
                description="Organize inspirations into curated groups."
                primaryAction={{
                  label: "Create Collection",
                  href: "/collections?add=1",
                }}
                secondaryAction={{
                  label: "View Favorites",
                  href: "/favorites",
                }}
              />
            </section>
          ) : null}

          {favoriteCount === 0 && inspirations.length > 0 ? (
            <section className="rounded-2xl border border-border/60 bg-muted/20 px-6 py-8">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border/60">
                  <HeartIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Save your first favorite</p>
                  <p className="text-sm text-muted-foreground">
                    Heart an inspiration in your library to quickly find it later.
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
