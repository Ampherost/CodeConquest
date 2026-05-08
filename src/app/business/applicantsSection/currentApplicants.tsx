"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { listCandidatesForBusiness, type CandidateWithInvitation } from "@/lib/db/candidates";

interface CurrentApplicantsProps {
  businessUserId: string;
  onSelect?: (candidate: CandidateWithInvitation) => void;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrentApplicants: React.FC<CurrentApplicantsProps> = ({
  businessUserId,
  onSelect,
  setSidebarOpen,
}) => {
  const [candidates, setCandidates] = useState<CandidateWithInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!businessUserId) return;

    const fetchCandidates = async () => {
      setLoading(true);
      const supabase = createClient();

      const result = await listCandidatesForBusiness(supabase, businessUserId, "completed");

      if (!result.ok) {
        console.error("Error fetching candidates:", result.error.message);
      } else {
        setCandidates(result.data);
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
              className="cursor-pointer w-full text-left hover:text-blue-400 transition-colors"
              onClick={() => {
                onSelect?.(c);
                setSidebarOpen?.((prev) => !prev);
              }}
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
