"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Signout from "../../business/header/signOut";

interface DashboardHeaderProps {
  onProfileClick: () => void;
  onInviteClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onProfileClick,
  onInviteClick,
}) => {
  const pathname = usePathname();

  const customNav = (
    <nav className="flex gap-8 items-center">
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
  );

  const rightActions = (
    <div className="flex items-center gap-6 text-white">
      <div
        className="flex items-center gap-2 hover:opacity-80 cursor-pointer"
        onClick={onProfileClick}
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
        onClick={onInviteClick}
        className="relative hover:opacity-80 cursor-pointer"
        aria-label="Invitations"
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

      <Signout />
    </div>
  );

  return (
    <Header
      initialRole="candidate"
      customNav={customNav}
      rightActions={rightActions}
    />
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
      className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
        isActive
          ? "text-white bg-zinc-800 font-semibold border-b-2 border-blue-500"
          : "text-zinc-400 hover:text-white hover:bg-zinc-850"
      }`}
    >
      {label}
    </Link>
  );
};

export default DashboardHeader;

