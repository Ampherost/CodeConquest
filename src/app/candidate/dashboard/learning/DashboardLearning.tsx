"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import ProfilePanel from "../profilePanel/ProfilePanel";
import InvitationPanel from "../notificationPanel/InvitationPanel";
import ModuleCard from "../../../components/ModuleCard";
import { dashboardModules } from "../../../../../lib/dashboardModules";

interface Props {
  userEmail: string | null;
}

const DashboardLearning: React.FC<Props> = ({ userEmail }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);

  const fetchInvites = useCallback(async () => {}, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <DashboardHeader
        onProfileClick={() => setProfileOpen(true)}
        onInviteClick={() => setInviteOpen(true)}
      />

      <main className="p-6">
        <h1 className="text-xl text-white">Welcome to your dashboard!</h1>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-2">
            Suggested learning Modules
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 px-1 py-3 w-max">
              {dashboardModules.map((mod, i) => (
                <Link href={`/modules/${mod.slug}`} key={i}>
                  <ModuleCard {...mod} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <InvitationPanel
        open={isInviteOpen}
        onClose={() => setInviteOpen(false)}
        onAccepted={fetchInvites}
      />
      <ProfilePanel
        open={isProfileOpen}
        onClose={() => setProfileOpen(false)}
        userEmail={userEmail}
      />
    </div>
  );
};

export default DashboardLearning;
