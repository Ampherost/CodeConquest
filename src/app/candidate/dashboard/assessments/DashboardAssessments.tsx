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
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfilePanel from '../profilePanel/ProfilePanel';
import InvitationPanel from '../notificationPanel/InvitationPanel';

interface Props {
  userEmail: string | null;
}

const DashboardAssessments: React.FC<Props> = ({ userEmail }) => {
  const pathname = usePathname();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const pendingAssessments = []; // ← Replace with Supabase or state later
  const completedAssessments = [];

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
            {/* Mail Icon */}
            <button onClick={() => setInviteOpen(true)} className="relative hover:opacity-80 cursor-pointer">
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
            <button className="hover:opacity-80">Sign Out</button>
            
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        <h1 className="text-xl text-white">Welcome to your dashboard!</h1>
        {/* Your dashboard cards and components go here */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-2">Your Assessments</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 py-1 w-max">
              {/* Tab Switcher */}
            <div className="flex gap-6 border-b border-zinc-600 mb-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-2 text-lg font-medium ${
                  activeTab === 'pending' ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-400'
                }`}
              >
                Pending <span className="ml-1 text-sm bg-zinc-700 px-2 py-0.5 rounded-full">{pendingAssessments.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-2 text-lg font-medium ${
                  activeTab === 'completed' ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-400'
                }`}
              >
                Completed <span className="ml-1 text-sm bg-zinc-700 px-2 py-0.5 rounded-full">{completedAssessments.length}</span>
              </button>
            </div>
            {/* Content Swap */}
            {activeTab === 'pending' ? (
              <div className="text-center mt-12">
                {pendingAssessments.length === 0 ? (
                  <>
                    <p className="text-lg font-semibold">You have no pending assessments</p>
                    <p className="text-sm text-zinc-400">Check back later or explore more modules.</p>
                  </>
                ) : (
                  <ul className="space-y-4">
                    {/* map quizzes */}
                  </ul>
                )}
              </div>
            ) : (
              <div className="text-center mt-12">
                {completedAssessments.length === 0 ? (
                  <>
                    <p className="text-lg font-semibold">No completed assessments yet</p>
                    <p className="text-sm text-zinc-400">They’ll appear here when finished.</p>
                  </>
                ) : (
                  <ul className="space-y-4">
                    {/* map completed quizzes */}
                  </ul>
                )}
              </div>
            )}
            </div>
          </div>
        </section>
      </main>
      <InvitationPanel open={isInviteOpen} onClose={() => setInviteOpen(false)} />
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

export default DashboardAssessments; 