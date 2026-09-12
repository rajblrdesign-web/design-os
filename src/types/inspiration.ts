export interface Inspiration {
  id: string;
  title: string;
  imageUrl: string;
  url: string;
  company: string;
  industry: string;
  tags: string[];
  createdAt: string;
}

export type InspirationFormValues = {
  title: string;
  company: string;
  industry: string;
  imageUrl: string;
  url: string;
  tags: string;
};
