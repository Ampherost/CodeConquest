import { useState } from "react";
import InvitationForm from "../sendInvitation/invitationForm";
interface InvitationButtonProps {
  business_user_id: string;
}

const InvitationButton = ({ business_user_id }: InvitationButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="hover:bg-green-500 cursor-pointer border-1 border-zinc-800 text-dark font-light rounded-md px-4 py-2"
        onClick={() => setOpen(true)}
      >
        Send Invitation
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-100 flex items-center justify-center bg-zinc-900/70 transition-all duration-300 ease-in-out  ${open ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 min-w-[350px]">
            <InvitationForm
              employeerId={business_user_id}
              onCancel={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationButton;
