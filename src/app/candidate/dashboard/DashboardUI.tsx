// import { redirect } from 'next/navigation'
// import { createClient } from '@/utils/supabase/server'

// export default async function PrivatePage() 
// {
//   const supabase = await createClient()

//   const { data, error } = await supabase.auth.getUser()

//   if (error || !data?.user) 
//   {
//     redirect('/login')
//   }

//   return (<p>Candidate Profile: {data.user.email}</p>)
// }

'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfilePanel from './profilePanel/ProfilePanel';
import NotificationPanel from './notificationPanel/NotificationPanel';
import ModuleCard from '../../components/ModuleCard'; 

const modules = [
  {
    title: 'Software Engineering',
    level: 'Intermediate',
    courses: 6,
    practices: 192,
    image: '/assets/software-engineer.png',
  },
  {
    title: 'Compilers',
    level: 'Advanced',
    courses: 5,
    practices: 87,
    image: '/assets/compiler.png',
  },
  {
    title: 'Web Development',
    level: 'Intermediate',
    courses: 3,
    practices: 63,
    image: '/assets/web-dev.png',
  },
];

interface Props {
  userEmail: string | null;
}

const DashboardUI: React.FC<Props> = ({ userEmail }) => {
  const pathname = usePathname();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const notificationCount = 2; // SOON TO EDIT FOR PRATICAL USE

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 shadow-md px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Tabs */}
          <div className="flex items-center gap-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-5">
              <Image src="/assets/CodeConquestLogo.png" alt="Logo" width={60} height={60} />
              <span className="text-2xl text-white font-semibold">CodeConquest</span>
            </div>

            {/* Tabs */}
            <nav className="flex gap-12 items-end pb-1">
              <TabLink href="/candidate/dashboard" label="Current" pathname={pathname} />
              <TabLink href="/candidate/dashboard/learning" label="Learning" pathname={pathname} />
              <TabLink href="/candidate/dashboard/assessments" label="Assessments" pathname={pathname} />
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

            {/* Bell */}
            <button onClick={() => setNotificationsOpen(true)} className="relative hover:opacity-80 cursor-pointer">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* 🔴 Badge */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Sign Out */}
            <button className="hover:opacity-80">Sign Out</button>
            
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        <h1 className="text-xl text-white">Welcome to your dashboard!</h1>
        {/* Your dashboard cards and components go here */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-2">Your Learning Modules</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 px-1 py-3 w-max">
              {modules.map((mod, i) => (
                <ModuleCard key={i} {...mod} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <NotificationPanel open={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <ProfilePanel open={isProfileOpen} onClose={() => setProfileOpen(false)} userEmail={userEmail} />
    </div>
  );
};

const TabLink: React.FC<{ href: string; label: string; pathname: string }> = ({ href, label, pathname }) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-end h-12 px-6 text-base tracking-wide transition-all duration-200 ${
        isActive
          ? 'text-white font-semibold border-b-2 border-blue-500'
          : 'text-zinc-400 border-b-2 border-transparent hover:text-white hover:border-blue-500'
      }`}
    >
      <span className="mt-auto mb-1">{label}</span>
    </Link>
  );
};

export default DashboardUI; 