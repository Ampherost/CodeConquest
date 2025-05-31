"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();

interface Candidate {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface CurrentApplicantsProps {
  businessUserId: string;
  onSelect?: (candidate: Candidate) => void;
}

const CurrentApplicants: React.FC<CurrentApplicantsProps> = ({
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
        .from("invitations")
        .select("candidate_user_id")
        .eq("business_user_id", businessUserId);

      if (invitesError) {
        console.error("Error fetching invitations:", invitesError);
        setLoading(false);
        return;
      }

      const candidateIds =
        (invites?.map((row) => row.candidate_user_id) as string[]) || [];

      if (candidateIds.length === 0) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      // 2. Fetch candidate names
      const { data: candRows, error: candError } = await supabase
        .from("candidate_users")
        .select("user_id, first_name, last_name")
        .in("user_id", candidateIds);

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
      <h1 className="font-bold text-2xl mb-4">Current Applicants</h1>

      {loading && <p className="text-sm text-zinc-400">Loading…</p>}

      {!loading && candidates.length === 0 && (
        <p className="text-sm text-zinc-400">No applicants yet.</p>
      )}

      <ul id="applicants" className="space-y-2">
        {candidates.map((c) => (
          <li key={c.user_id}>
            <button
              className="w-full text-left hover:text-blue-400 transition-colors"
              onClick={() => onSelect?.(c)}
            >
              {c.first_name} {c.last_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentApplicants;
