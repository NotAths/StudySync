import React from "react";
import { WelcomeSection } from "./WelcomeSection";
import { StatCards } from "./StatCards";
import { CreateKitCard } from "./CreateKitCard";
import { RecentStudyKits } from "./RecentStudyKits";
import { UpcomingRevision } from "./UpcomingRevision";

export function DashboardView() {
  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Section */}
      <WelcomeSection />

      {/* 2. Four Statistic Cards */}
      <StatCards />

      {/* 3. Featured Create a Study Kit Card */}
      <CreateKitCard />

      {/* 4. Recent Study Kits & Upcoming Revision Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentStudyKits />
        <UpcomingRevision />
      </div>
    </div>
  );
}

