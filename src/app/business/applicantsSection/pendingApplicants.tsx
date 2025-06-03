"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Represents a pending applicant profile (not yet accepted or completed)
interface PendingCandidate {
  user_id: string;
  full_name: string;
  email: string;
  position: string;
  notes: string;
  invite_code?: string;
  invitation_id?: string;
}

interface pendingApplicantsProps {
  businessUserId: string;
  onSelect?: (candidate: PendingCandidate) => void;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PendingApplicants: React.FC<pendingApplicantsProps> = ({
  businessUserId,
  onSelect,
  setSidebarOpen,
}) => {
  const [candidates, setCandidates] = useState<PendingCandidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!businessUserId) return;

    const fetchCandidates = async () => {
      setLoading(true);

      // 1. All invitations for this business user
      const { data: candRows, error: candError } = await supabase
        .from("invitation_codes")
        .select("invite_code, full_name, email, position, notes")
        .eq("business_user_id", businessUserId)
        .eq("status", "pending");

      if (candError) {
        console.error("Error fetching candidate users:", candError);
        setCandidates([]);
      } else {
        setCandidates(candRows as PendingCandidate[]);
      }

      setLoading(false);
      return;
    };

    fetchCandidates();
  }, [businessUserId]);

  return (
    <div className="min-w-[1000px] min-h-[300px] flex-grow rounded-r-sm p-4 bg-zinc-800 border border-zinc-700 shadow-sm">
      <h1 className="font-bold text-2xl mb-4">Pending Applicants</h1>

      {loading && <p className="text-sm text-zinc-400">Loading…</p>}

      {!loading && candidates.length === 0 && (
        <p className="text-sm text-zinc-400">No applicants yet.</p>
      )}

      <ul id="applicants" className="space-y-2">
        {candidates.map((c) => (
          <li key={c.invite_code}>
            <button
              className="cursor-pointer w-full text-left hover:text-blue-400 transition-colors"
              onClick={() => {
                onSelect?.({ ...c, invitation_id: "" });
                setSidebarOpen?.((prev) => !prev); // Toggle sidebar open state
              }}
            >
              {c.full_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingApplicants;
