const CLIENT_ID_STORAGE_KEY = "design-os-client-id";

export function getClientId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existing = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY)?.trim();
    if (existing) {
      return existing;
    }

    const clientId = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId);
    return clientId;
  } catch {
    return "";
  }
}
