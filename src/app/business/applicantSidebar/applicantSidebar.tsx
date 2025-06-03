"use client";
import AssignedTask from "./assignedTask";
import AvailableTask from "./availableTasks";
import SideBarHeader from "./header";
import Notes from "./notes";
import defaultProfilePic from "../../../../public/assets/defaultProfile.png";
import expand from "../../../../public/assets/expand.png";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import Image from "next/image";

const supabase = await createClient();
interface PendingCandidate {
  user_id: string;
  full_name: string;
  email: string;
  position?: string;
  notes?: string;
  invitation_id?: string;
}
interface ApplicantSidebarProps {
  candidateID: string;
  invitationID: string;
  pendingData?: PendingCandidate;
  setSidebarOpen?: (open: boolean) => void;
  sidebarCollapse?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApplicantSidebar = ({
  candidateID,
  invitationID,
  pendingData,
  setSidebarOpen,
  sidebarCollapse,
}: ApplicantSidebarProps) => {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("Loading...");
  const [status, setStatus] = useState("Loading...");
  const [position, setPosition] = useState("Loading...");
  const [notes, setNotes] = useState("Loading...");
  const [refreshToggle, setRefreshToggle] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (pendingData) {
        setName(pendingData.full_name);
        setPosition(pendingData.position || "Unknown");
        setStatus("Pending");
        setNotes(pendingData.notes || "None");
      } else {
        try {
          const { data: nameData, error: nameError } = await supabase
            .from("candidate_users")
            .select("first_name, last_name")
            .eq("user_id", candidateID)
            .single();

          if (nameError || !nameData) {
            setName("Unknown Candidate");
          } else {
            setName(`${nameData.first_name} ${nameData.last_name}`);
          }

          const { data: inviteData, error: inviteError } = await supabase
            .from("invitations")
            .select("status, position, notes")
            .eq("invitation_id", invitationID)
            .single();

          if (inviteError || !inviteData) {
            setStatus("Unknown");
            setPosition("Unknown");
            setNotes("Unknown");
          } else {
            setStatus(inviteData.status);
            setPosition(inviteData.position);
            setNotes(inviteData.notes);
          }
        } catch (err) {
          console.error("Error fetching sidebar data:", err);
        }
      }
    };

    fetchData();
  }, [candidateID, invitationID, pendingData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`${sidebarCollapse ? "" : ""}  `}>
      <div className="flex justify-between p-5">
        <button
          onClick={() => sidebarCollapse?.((prev) => !prev)}
          className="text-white text-xl hover:text-gray-400 transition-colors cursor-pointer"
        >
          <Image
            src={expand}
            alt="Expand Sidebar"
            width={30}
            height={24}
            className="transform transition-transform duration-300"
          />
        </button>
        <button
          className="text-white text-xl hover:text-gray-500 transition-colors cursor-pointer"
          onClick={() => setSidebarOpen?.(false)}
        >
          X
        </button>
      </div>
      <div className="flex p-5 space-x-2 mb-10">
        <Image
          src={defaultProfilePic}
          alt="Profile"
          width={300}
          height={15}
          className="rounded-full"
        />
      </div>
      <div className="p-5 space-y-4">
        <h1 className="text-white">Profile {pendingData ? "" : ""}</h1>
        <SideBarHeader name={name} status={status} position={position} />
        {!pendingData && (
          <div
            className={`transform transition-transform duration-500 ease-out ${
              mounted ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <AssignedTask
              invitation_id={invitationID}
              refreshToggle={refreshToggle}
              OnUnassigned={() => setRefreshToggle((prev) => prev + 1)}
            />
            <AvailableTask
              invitation_id={invitationID}
              onAssigned={() => setRefreshToggle((prev) => prev + 1)}
              refreshToggle={refreshToggle}
            />
          </div>
        )}
        <Notes notes={notes} />
      </div>
    </div>
  );
};

export default ApplicantSidebar;
