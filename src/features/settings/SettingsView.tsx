"use client";

import {
  CheckIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/hooks/use-favorites";
import {
  readWorkspaceName,
  writeWorkspaceName,
} from "@/lib/settings-storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getErrorMessage, showError, showSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: Array<{
  value: ThemeOption;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [savedWorkspaceName, setSavedWorkspaceName] = React.useState("");
  const { favoriteCount, clearAllFavorites } = useFavorites();
  const [saveState, setSaveState] = React.useState<"idle" | "saved">("idle");

  React.useEffect(() => {
    setMounted(true);
    const storedName = readWorkspaceName();
    setWorkspaceName(storedName);
    setSavedWorkspaceName(storedName);
  }, []);

  const handleSaveWorkspaceName = () => {
    const trimmedName = workspaceName.trim();
    writeWorkspaceName(trimmedName);
    setSavedWorkspaceName(trimmedName);
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 2000);
  };

  const handleClearFavorites = async () => {
    if (favoriteCount === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Remove all ${favoriteCount} favorites? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await clearAllFavorites();
      showSuccess("Favorites cleared");
    } catch (error) {
      showError(
        "Could not clear favorites",
        getErrorMessage(error, "Something went wrong.")
      );
    }
  };

  const supabaseConfigured = isSupabaseConfigured();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const maskedSupabaseUrl = supabaseUrl
    ? supabaseUrl.replace(/^https?:\/\//, "").split(".")[0] + ".supabase.co"
    : "Not configured";

  const workspaceNameChanged =
    workspaceName.trim() !== savedWorkspaceName.trim();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        description="Manage your workspace preferences and local data."
      />

      <div className="flex max-w-2xl flex-col gap-6">
        <SettingsCard
          title="Workspace"
          description="Name shown on your dashboard and workspace overview."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="Design Team"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSaveWorkspaceName();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleSaveWorkspaceName}
              disabled={!workspaceNameChanged}
              className="shrink-0 sm:min-w-24"
            >
              {saveState === "saved" ? (
                <>
                  <CheckIcon />
                  Saved
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Appearance"
          description="Choose how Design OS looks on your device."
        >
          {mounted ? (
            <div className="flex flex-wrap gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => {
                const isActive = (theme ?? "system") === value;

                return (
                  <Button
                    key={value}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(value)}
                    className={cn(isActive && "pointer-events-none")}
                  >
                    <Icon />
                    {label}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-2">
              {themeOptions.map(({ value, label }) => (
                <Button key={value} type="button" variant="outline" size="sm" disabled>
                  {label}
                </Button>
              ))}
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          title="Local data"
          description="Favorites are saved in Supabase for this browser session until auth is added."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Favorites</p>
              <p className="text-sm text-muted-foreground">
                {favoriteCount}{" "}
                {favoriteCount === 1 ? "saved item" : "saved items"} in this
                browser
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFavorites}
              disabled={favoriteCount === 0}
              className="shrink-0"
            >
              <Trash2Icon />
              Clear favorites
            </Button>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Connection"
          description="Backend status for your Design OS workspace."
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Supabase</span>
              <Badge variant={supabaseConfigured ? "secondary" : "outline"}>
                {supabaseConfigured ? "Connected" : "Not configured"}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Project</span>
              <span className="truncate text-sm font-medium">
                {maskedSupabaseUrl}
              </span>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

type SettingsCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
