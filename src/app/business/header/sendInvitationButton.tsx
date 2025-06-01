import { useState } from "react";
import InvitationForm from "../../components/InvitationForm";

interface InvitationButtonProps {
  business_user_id: string;
}

const InvitationButton = ({ business_user_id }: InvitationButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-green-500 text-dark font-light rounded-md px-4 py-2"
        onClick={() => setOpen(true)}
      >
        Send Invitation
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 min-w-[350px]">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-xl font-bold text-zinc-500 hover:text-zinc-800"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <InvitationForm employeerId={business_user_id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationButton;
