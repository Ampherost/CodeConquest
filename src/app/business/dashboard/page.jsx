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
import ApplicantSidebar from "../applicantSidebar/applicantSidebar";

const supabase =  createClient();

const Page = () => 
{
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapse, setSidebarCollapse] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
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
          <Invitation business_user_id={user.id} />
          <Signout />
        </div>
      </div>
      <div className="flex flex-row">
        {sidebarCollapse && (
          <div id="main" className="space-y-5 flex-[3] ">
            <div id="Current Applicants" className="flex flex-row p-7">
              <CurrentApplicants
                businessUserId={user.id}
                setSidebarOpen={setSidebarOpen}
                onSelect={(candidate) =>
                  setSelectedCandidate({
                    user_id: candidate.user_id,
                    invitation_id: candidate.invitation_id,
                  })
                }
              />
            </div>
            <div id="Pending Applicatns" className="flex flex-row p-7">
              <PendingApplicants
                businessUserId={user.id}
                setSidebarOpen={setSidebarOpen}
                onSelect={(candidate) =>
                  setSelectedCandidate({
                    ...candidate,
                    invitation_id: "",
                  })
                }
              />
            </div>
          </div>
        )}
        {sidebarOpen && selectedCandidate && (
          <div
            id="sidebar"
            className={`${sidebarOpen ? "block w-64" : "hidden"} flex-[1]`}
          >
            <div
              className={`fixed top-0 right-0 h-full flex-[1] bg-zinc-800 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>
            <ApplicantSidebar
              candidateID={selectedCandidate.user_id}
              invitationID={selectedCandidate.invitation_id}
              pendingData={
                selectedCandidate.invitation_id === ""
                  ? selectedCandidate
                  : undefined
              }
              setSidebarOpen={setSidebarOpen}
              sidebarCollapse={setSidebarCollapse}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
