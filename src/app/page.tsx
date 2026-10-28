import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function Home() {
  return (
    <AppLayout>
      <DashboardView />
    </AppLayout>
  );
}
