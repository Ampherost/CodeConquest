"use client";

import { useState } from "react";
import InvitationModal from "@/app/business/sendInvitation/invitationModal";

interface InvitationButtonProps {
  business_user_id: string;
  onSuccess: (inviteCode: string) => void;
}

const InvitationButton = ({
  business_user_id,
  onSuccess,
}: InvitationButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = (inviteCode: string) => {
    onSuccess(inviteCode);
    setOpen(false);
  };

  return (
    <div>
      <button
        className="hover:bg-green-500 cursor-pointer border-1 border-zinc-800 text-dark font-light rounded-md px-4 py-2"
        onClick={() => setOpen(true)}
      >
        Send Invitation
      </button>

      <InvitationModal
        open={open}
        business_user_id={business_user_id}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default InvitationButton;
