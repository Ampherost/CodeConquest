"use client";

import InvitationForm from "@/app/business/sendInvitation/formFieldInvitation";

interface InvitationModalProps {
  open: boolean;
  business_user_id: string;
  onClose: () => void;
  onSuccess: (inviteCode: string) => void;
}

const InvitationModal = ({
  open,
  business_user_id,
  onClose,
  onSuccess,
}: InvitationModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-900/70 transition-all duration-300 ease-in-out opacity-100 scale-100"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Send invitation"
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 min-w-[350px]"
        onClick={(e) => e.stopPropagation()}
      >
        <InvitationForm
          employeerId={business_user_id}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

export default InvitationModal;