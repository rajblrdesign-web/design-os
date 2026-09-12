import { Suspense } from "react";

import { InspirationLibrary } from "@/features/inspiration/InspirationLibrary";

export default function InspirationPage() {
  return (
    <Suspense fallback={null}>
      <InspirationLibrary />
    </Suspense>
  );
}
