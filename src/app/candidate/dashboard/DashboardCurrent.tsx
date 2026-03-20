"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import ProfilePanel from "./profilePanel/ProfilePanel";
import InvitationPanel from "./notificationPanel/InvitationPanel";
import ModuleCard from "../../components/ModuleCard";
import { currentModules } from "../../../../lib/dashboardModules";

type LastModule = {
  moduleId: string;
  title: string;
  chapterSlug: string;
  timestamp: number;
};

interface Props {
  userEmail: string | null;
}

const DashboardCurrent: React.FC<Props> = ({ userEmail }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [lastModule, setLastModule] = useState<LastModule | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastViewedModule");
    if (stored) {
      try {
        setLastModule(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse lastViewedModule:", e);
      }
    }
  }, []);

  const fetchInvites = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("invitations")
      .select("invitation_id, position, status, assessment_id")
      .eq("candidate_user_id", user.id);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <DashboardHeader
        onProfileClick={() => setProfileOpen(true)}
        onInviteClick={() => setInviteOpen(true)}
      />

      <main className="p-6">
        <h1 className="text-xl text-white">Welcome to your dashboard!</h1>

        {lastModule && (
          <section className="mt-6 mb-10">
            <h2 className="text-lg font-semibold text-white mb-2">
              Resume Module
            </h2>
            <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
              <p className="text-white font-medium">
                Last visited:{" "}
                <span className="text-zinc-300">{lastModule.title}</span>
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                Module ID: {lastModule.moduleId}
              </p>
              <p className="text-sm text-zinc-400">
                Chapter: {lastModule.chapterSlug}
              </p>
              <Link
                href={`/modules/${lastModule.moduleId}/${lastModule.chapterSlug}`}
                className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Continue Learning
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-2">
            Your current learning Modules
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 px-1 py-3 w-max">
              {currentModules.map((mod, i) => (
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

export default DashboardCurrent;
