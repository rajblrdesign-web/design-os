import { createClient } from "@/lib/supabase/client";
import { type InspirationRow } from "@/types/database";
import {
  type Inspiration,
  type InspirationFormValues,
} from "@/types/inspiration";
import { parseTagsInput } from "@/lib/inspiration-utils";

function mapRowToInspiration(row: InspirationRow): Inspiration {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    url: row.url,
    company: row.company,
    industry: row.industry,
    tags: row.tags,
    createdAt: row.created_at,
  };
}

function mapFormToInsert(values: InspirationFormValues) {
  return {
    title: values.title.trim(),
    image_url: values.imageUrl.trim(),
    url: values.url.trim(),
    company: values.company.trim(),
    industry: values.industry.trim(),
    tags: parseTagsInput(values.tags),
  };
}

export async function getInspirations(): Promise<Inspiration[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inspirations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as InspirationRow[]).map(mapRowToInspiration);
}

export async function createInspiration(
  values: InspirationFormValues
): Promise<Inspiration> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inspirations")
    .insert(mapFormToInsert(values))
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToInspiration(data as InspirationRow);
}

export async function updateInspiration(
  id: string,
  values: InspirationFormValues
): Promise<Inspiration> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inspirations")
    .update(mapFormToInsert(values))
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToInspiration(data as InspirationRow);
}

export async function deleteInspiration(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("inspirations").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
