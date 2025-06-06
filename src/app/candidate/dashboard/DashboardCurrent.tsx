"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import ProfilePanel from "./profilePanel/ProfilePanel";
import InvitationPanel from "./notificationPanel/InvitationPanel";
import ModuleCard from "../../components/ModuleCard";
import Signout from "../../business/header/signOut";

import { useEffect, useState } from "react";

type LastModule = {
  moduleId: string;
  title: string;
  chapterSlug: string;
  timestamp: number;
};

const modules = [
  {
    title: "Software Engineering",
    level: "Intermediate",
    chapters: 6,
    quizzes: 6,
    image: "/assets/software-engineer.png",
    slug: "software-engineering",
  },
  {
    title: "Compilers",
    level: "Advanced",
    chapters: 4,
    quizzes: 3,
    image: "/assets/compiler.png",
    slug: "compilers",
  },
  {
    title: "Web Development",
    level: "Intermediate",
    chapters: 6,
    quizzes: 5,
    image: "/assets/web-dev.png",
    slug: "web-development",
  },
];

interface Props {
  userEmail: string | null;
}

const DashboardCurrent: React.FC<Props> = ({ userEmail }) => {
  const pathname = usePathname();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);
  // const [pendingAssessments, setPendingAssessments] = useState<AssessmentInvite[]>([]);
  // const [completedAssessments, setCompletedAssessments] = useState<AssessmentInvite[]>([]);
  const [lastModule, setLastModule] = useState<LastModule | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastViewedModule");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLastModule(parsed);
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

    // No state setting required here
  }, []);

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
        {/* Dashboard cards and components*/}
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
            Your current leanring Models
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 px-1 py-3 w-max">
              {modules.map((mod, i) => (
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

export default DashboardCurrent;
