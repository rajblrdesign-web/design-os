import { createClient } from "@/lib/supabase/client";
import {
  type Collection,
  type CollectionDetail,
  type CollectionFormValues,
} from "@/types/collection";
import {
  type CollectionRow,
  type InspirationRow,
} from "@/types/database";
import { type Inspiration } from "@/types/inspiration";

type CollectionWithItemsRow = CollectionRow & {
  collection_items: Array<{
    inspiration: InspirationRow | null;
  }>;
};

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

function mapRowToCollection(row: CollectionWithItemsRow): Collection {
  const items = row.collection_items ?? [];
  const previewImageUrls = items
    .map((item) => item.inspiration?.image_url)
    .filter((url): url is string => Boolean(url))
    .slice(0, 3);
  const inspirationIds = items
    .map((item) => item.inspiration?.id)
    .filter((id): id is string => Boolean(id));

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    itemCount: items.length,
    inspirationIds,
    previewImageUrls,
    createdAt: row.created_at,
  };
}

const collectionSelect = `
  *,
  collection_items (
    inspiration:inspirations (*)
  )
`;

export async function getCollections(): Promise<Collection[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("collections")
    .select(collectionSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CollectionWithItemsRow[]).map(mapRowToCollection);
}

export async function getCollectionById(id: string): Promise<CollectionDetail> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("collections")
    .select(collectionSelect)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as CollectionWithItemsRow;
  const collection = mapRowToCollection(row);
  const inspirations = (row.collection_items ?? [])
    .map((item) => item.inspiration)
    .filter((inspiration): inspiration is InspirationRow => Boolean(inspiration))
    .map(mapRowToInspiration);

  return {
    ...collection,
    inspirations,
  };
}

export async function createCollection(
  values: CollectionFormValues
): Promise<Collection> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("collections")
    .insert({
      name: values.name.trim(),
      description: values.description.trim() || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as CollectionRow;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    itemCount: 0,
    inspirationIds: [],
    previewImageUrls: [],
    createdAt: row.created_at,
  };
}

export async function updateCollection(
  id: string,
  values: CollectionFormValues
): Promise<Pick<Collection, "id" | "name" | "description">> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("collections")
    .update({
      name: values.name.trim(),
      description: values.description.trim() || null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as CollectionRow;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
  };
}

export async function addInspirationToCollection(
  collectionId: string,
  inspirationId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("collection_items").insert({
    collection_id: collectionId,
    inspiration_id: inspirationId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeInspirationFromCollection(
  collectionId: string,
  inspirationId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("collection_items")
    .delete()
    .eq("collection_id", collectionId)
    .eq("inspiration_id", inspirationId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCollection(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
