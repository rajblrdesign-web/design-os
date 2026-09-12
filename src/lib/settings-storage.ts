const WORKSPACE_NAME_STORAGE_KEY = "design-os-workspace-name";

export function readWorkspaceName(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(WORKSPACE_NAME_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function writeWorkspaceName(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    window.localStorage.removeItem(WORKSPACE_NAME_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(WORKSPACE_NAME_STORAGE_KEY, trimmedName);
}
