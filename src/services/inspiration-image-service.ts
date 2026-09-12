import { createClient } from "@/lib/supabase/client";

const BUCKET = "inspirations";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateInspirationImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return "Use a JPG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function uploadInspirationImage(file: File): Promise<string> {
  const validationError = validateInspirationImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = createClient();
  const path = `${crypto.randomUUID()}.${getFileExtension(file)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    if (error.message.toLowerCase().includes("bucket")) {
      throw new Error(
        "Image storage is not set up. Run supabase/migrations/003_inspiration_storage.sql in Supabase."
      );
    }

    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
