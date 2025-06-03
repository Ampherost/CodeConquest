"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import ProfilePanel from "../profilePanel/ProfilePanel";
import InvitationPanel from "../notificationPanel/InvitationPanel";
import Signout from "../../../business/header/signOut";

interface Props {
  userEmail: string | null;
}

type AssessmentInvite = {
  invitation_id: string;
  position: string;
  assessment_id: string;
  quiz_id: string | null;
  status: string;
};

const DashboardAssessments: React.FC<Props> = ({ userEmail }) => {
  const pathname = usePathname();
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

    const { data, error } = await supabase
      .from("invitations")
      .select(
        `
      invitation_id,
      position,
      status,
      assessment_id,
      assessment_quizzes:assessment_id (
        quiz_id,
        status
      )
    `
      )
      .eq("candidate_user_id", user.id);

    if (!error && data) {
      // Build one list item per quiz so multiple pending quizzes show up
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
    }
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 shadow-md px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Tabs */}
          <div className="flex items-center gap-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-5">
              <Image
                src="/assets/CodeConquestLogo.png"
                alt="Logo"
                width={60}
                height={60}
              />
              <span className="text-2xl text-white font-semibold">
                CodeConquest
              </span>
            </div>

            {/* Tabs */}
            <nav className="flex gap-12 items-end pb-1">
              <TabLink
                href="/candidate/dashboard"
                label="Current"
                pathname={pathname}
              />
              <TabLink
                href="/candidate/dashboard/learning"
                label="Learning"
                pathname={pathname}
              />
              <TabLink
                href="/candidate/dashboard/assessments"
                label="Assessments"
                pathname={pathname}
              />
            </nav>
          </div>

          {/* Right: Profile + Bell + Sign Out */}
          <div className="flex items-center gap-6 text-white">
            <div
              className="flex items-center gap-2 hover:opacity-80 cursor-pointer"
              onClick={() => setProfileOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.8.755 6.879 2.047M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Profile</span>
            </div>
            {/* Mail Icon */}
            <button
              onClick={() => setInviteOpen(true)}
              className="relative hover:opacity-80 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Sign Out */}
            {/* <button className="hover:opacity-80">Sign Out</button>
             */}
            <Signout />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        <h1 className="text-xl text-white">Welcome to your dashboard!</h1>
        {/* Dashboard cards and components */}
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
                      {/*   key={assessment.invitation_id} */}
                      {pendingAssessments.map((assessment) => (
                        <li
                          key={`${assessment.invitation_id}-${assessment.quiz_id}`}
                          className="bg-zinc-800 p-4 rounded-lg"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-white">
                                Your Assesment is Pendiing
                              </h3>
                              <p className="text-sm text-zinc-400">
                                For: {assessment.position}
                              </p>
                              <p></p>
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
                        They’ll appear here when finished.
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

const TabLink: React.FC<{ href: string; label: string; pathname: string }> = ({
  href,
  label,
  pathname,
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-end h-12 px-6 text-base tracking-wide transition-all duration-200 ${
        isActive
          ? "text-white font-semibold border-b-2 border-blue-500"
          : "text-zinc-400 border-b-2 border-transparent hover:text-white hover:border-blue-500"
      }`}
    >
      <span className="mt-auto mb-1">{label}</span>
    </Link>
  );
};

export default DashboardAssessments;
