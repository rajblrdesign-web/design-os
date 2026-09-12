import { type Inspiration } from "@/types/inspiration";

export type Collection = {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
  inspirationIds: string[];
  previewImageUrls: string[];
  createdAt: string;
};

export type CollectionDetail = Collection & {
  inspirations: Inspiration[];
};

export type CollectionFormValues = {
  name: string;
  description: string;
};
