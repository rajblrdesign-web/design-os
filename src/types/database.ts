export interface InspirationRow {
  id: string;
  title: string;
  image_url: string;
  url: string;
  company: string;
  industry: string;
  tags: string[];
  created_at: string;
}

export interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CollectionItemRow {
  id: string;
  collection_id: string;
  inspiration_id: string;
  created_at: string;
}

export interface FavoriteRow {
  id: string;
  client_id: string;
  inspiration_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      inspirations: {
        Row: InspirationRow;
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          url: string;
          company: string;
          industry: string;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          url?: string;
          company?: string;
          industry?: string;
          tags?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: CollectionRow;
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      collection_items: {
        Row: CollectionItemRow;
        Insert: {
          id?: string;
          collection_id: string;
          inspiration_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string;
          inspiration_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: FavoriteRow;
        Insert: {
          id?: string;
          client_id: string;
          inspiration_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          inspiration_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
