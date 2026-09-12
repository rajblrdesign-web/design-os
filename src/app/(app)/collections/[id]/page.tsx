import { CollectionDetailView } from "@/features/collections/CollectionDetailView";

type CollectionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { id } = await params;

  return <CollectionDetailView collectionId={id} />;
}
