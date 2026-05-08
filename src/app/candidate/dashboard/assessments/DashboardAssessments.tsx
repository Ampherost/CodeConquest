"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { listInvitationsForCandidate } from "@/lib/db/invitations";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import ProfilePanel from "../profilePanel/ProfilePanel";
import InvitationPanel from "../notificationPanel/InvitationPanel";

interface Props {
  userEmail: string | null;
}

type AssessmentInvite = {
  invitation_id: string;
  position: string;
  assessment_id: string;
  quiz_id: number | null;
  status: string;
};

const DashboardAssessments: React.FC<Props> = ({ userEmail }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );
  const [pendingAssessments, setPendingAssessments] = useState<
    AssessmentInvite[]
  >([]);
  const [completedAssessments, setCompletedAssessments] = useState<
    AssessmentInvite[]
  >([]);

  const fetchInvites = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const result = await listInvitationsForCandidate(supabase, user.id);
    if (!result.ok) return;

    const data = result.data;

    const pending = data.flatMap((inv) =>
      (Array.isArray(inv.assessment_quizzes) ? inv.assessment_quizzes : [])
        .filter((q) => q.status === "pending")
        .map((q) => ({
          invitation_id: inv.invitation_id,
          position: inv.position,
          assessment_id: inv.assessment_id,
          quiz_id: q.quiz_id,
          status: q.status,
        }))
    );

    const completed = data.flatMap((inv) =>
      (Array.isArray(inv.assessment_quizzes) ? inv.assessment_quizzes : [])
        .filter((q) => q.status === "completed")
        .map((q) => ({
          invitation_id: inv.invitation_id,
          position: inv.position,
          assessment_id: inv.assessment_id,
          quiz_id: q.quiz_id,
          status: q.status,
        }))
    );

    setPendingAssessments(pending);
    setCompletedAssessments(completed);
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

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
            Your Assessments
          </h2>
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-6 py-1">
              {/* Tab Switcher */}
              <div className="flex gap-6 border-b border-zinc-600 mb-4">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`pb-2 text-lg font-medium ${
                    activeTab === "pending"
                      ? "border-b-2 border-blue-500 text-white"
                      : "text-zinc-400"
                  }`}
                >
                  Pending{" "}
                  <span className="ml-1 text-sm bg-zinc-700 px-2 py-0.5 rounded-full">
                    {pendingAssessments.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`pb-2 text-lg font-medium ${
                    activeTab === "completed"
                      ? "border-b-2 border-blue-500 text-white"
                      : "text-zinc-400"
                  }`}
                >
                  Completed{" "}
                  <span className="ml-1 text-sm bg-zinc-700 px-2 py-0.5 rounded-full">
                    {completedAssessments.length}
                  </span>
                </button>
              </div>

              {/* Content Swap */}
              {activeTab === "pending" ? (
                <div className="text-center mt-12 flex flex-col">
                  {pendingAssessments.length === 0 ? (
                    <>
                      <p className="text-lg font-semibold">
                        You have no pending assessments
                      </p>
                      <p className="text-sm text-zinc-400 flex flex-col">
                        Check back later or explore more modules.
                      </p>
                    </>
                  ) : (
                    <ul className="space-y-4">
                      {pendingAssessments.map((assessment) => (
                        <li
                          key={`${assessment.invitation_id}-${assessment.quiz_id}`}
                          className="bg-zinc-800 p-4 rounded-lg"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                Your Assessment is Pending
                              </h3>
                              <p className="text-sm text-zinc-400">
                                For: {assessment.position}
                              </p>
                            </div>
                            {assessment.quiz_id ? (
                              <Link
                                href={`/assesment/${assessment.assessment_id}/quiz/${assessment.quiz_id}`}
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                              >
                                Start Quiz
                              </Link>
                            ) : (
                              <span className="text-sm text-red-500">
                                Quiz not linked
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="text-center mt-12">
                  {completedAssessments.length === 0 ? (
                    <>
                      <p className="text-lg font-semibold">
                        No completed assessments yet
                      </p>
                      <p className="text-sm text-zinc-400">
                        They will appear here when finished.
                      </p>
                    </>
                  ) : (
                    <ul className="space-y-4">
                      {completedAssessments.map((assessment) => (
                        <li
                          key={`${assessment.invitation_id}-${assessment.quiz_id}`}
                          className="bg-zinc-800 p-4 rounded-lg"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                Completed Assessment
                              </h3>
                              <p className="text-sm text-zinc-400">
                                Position: {assessment.position}
                              </p>
                            </div>
                            <Link
                              href={`/assesment/${assessment.assessment_id}/quiz/${assessment.quiz_id}/review`}
                              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                            >
                              Review Quiz
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
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

export default DashboardAssessments;
