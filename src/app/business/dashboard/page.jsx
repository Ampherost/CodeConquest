"use client";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";


import { useState, useEffect } from "react";

import Welcome from "../header/welcome";
import Invitation from "../header/sendInvitationButton";
import LogoComponent from "../header/logoComponent";
import Notifications from "../header/notification";
import Signout from "../header/signOut";
import Profile from "../header/userProfile";
import CurrentApplicants from "../applicantsSection/currentApplicants";
import PendingApplicants from "../applicantsSection/pendingApplicants";

const supabase = createClient();

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  if (!user) return null;

  return (
    //main page
    <div className="bg-zinc-900 min-h-screen">
      <div
        id="header"
        className="flex flex-row justify-between items-start w-full
        px-15 py-4"
      >
        <div className="flex flex-row items-center space-x-4">
          <LogoComponent />
          <Welcome />
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Profile />
          <Notifications />
          <Invitation />
          <Signout />
        </div>
      </div>

      <div id="main" className="space-y-5">
         <div id="Current Applicants" className="flex flex-row p-7">
          <CurrentApplicants businessUserId={user.id} />
        </div>
        <div id="Pending Applicatns" className="flex flex-row p-7">
          <PendingApplicants businessUserId={user.id} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

  
