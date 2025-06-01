"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface Candidate {
  user_id: string;
  full_name: string;
  email: string;
  position?: string;
  notes?: string;
  invite_code?: string;
}

interface pendingApplicantsProps {
  businessUserId: string;
  onSelect?: (candidate: Candidate) => void;
}

const PendingApplicants: React.FC<pendingApplicantsProps> = ({
  businessUserId,
  onSelect,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!businessUserId) return;

    const fetchCandidates = async () => {
      setLoading(true);

      // 1. All invitations for this business user
      const { data: invites, error: invitesError } = await supabase
        .from("invitation_codes")
        .select("full_name")
        .eq("business_user_id", businessUserId)
        .eq("status", "pending");

      if (invitesError) {
        console.error(
          "Error fetching invitations:",
          JSON.stringify(invitesError, null, 2)
        );
        setLoading(false);
        return;
      }

      const candidateName =
        (invites?.map((row) => row.full_name) as string[]) || [];

      if (candidateName.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      // 2. Fetch candidate names
      const { data: candRows, error: candError } = await supabase
        .from("invitation_codes")
        .select("invite_code, full_name, email, position, notes");

      if (candError) {
        console.error("Error fetching candidate users:", candError);
      } else {
        setCandidates((candRows ?? []) as Candidate[]);
      }

      setLoading(false);
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
              className="w-full text-left hover:text-blue-400 transition-colors"
              onClick={() => onSelect?.(c)}
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
