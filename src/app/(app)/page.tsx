import { Suspense } from "react";

import { WorkspaceDashboard } from "@/features/dashboard/WorkspaceDashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceDashboard />
    </Suspense>
  );
}
