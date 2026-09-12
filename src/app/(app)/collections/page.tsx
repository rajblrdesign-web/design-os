import { Suspense } from "react";

import { CollectionsLibrary } from "@/features/collections/CollectionsLibrary";

export default function CollectionsPage() {
  return (
    <Suspense fallback={null}>
      <CollectionsLibrary />
    </Suspense>
  );
}
