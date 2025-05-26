'use client';

import React, { useState } from 'react';

interface InvitationPanelProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (code: string) => void; // optional callback
}

const InvitationPanel: React.FC<InvitationPanelProps> = ({ open, onClose, onSubmit }) => {
  const [code, setCode] = useState('');

  const handleAccept = () => {
    if (onSubmit) {
      onSubmit(code); // send code up to parent if needed
    }
    setCode('');
    onClose(); // close panel after submit
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-300 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Input Invitation Code:</h2>
        <button
          onClick={onClose}
          className="text-2xl font-bold text-zinc-500 hover:text-red-500"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Input Section */}
      <div className="p-6 space-y-6">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Input code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-zinc-300 dark:border-zinc-600 focus:outline-none"
          />
          <button
            className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700"
            onClick={handleAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationPanel;


// 'use client'

// import React from 'react'
// import AcceptInvitationForm from '../notificationPanel/AcceptInvitationForm'

// interface Props {
//   open: boolean
//   onClose: () => void
// }

// const InvitationPanel: React.FC<Props> = ({ open, onClose }) => {
//   return (
//     <div
//       className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
//         open ? 'translate-x-0' : 'translate-x-full'
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
//         <h2 className="text-lg font-semibold text-white">Join via Code</h2>
//         <button
//           onClick={onClose}
//           className="text-xl text-zinc-400 hover:text-red-500"
//         >
//           ×
//         </button>
//       </div>

//       {/* Body */}
//       <div className="p-6">
//         <p className="text-sm text-zinc-400 mb-2">
//           Enter a valid invitation code from your company.
//         </p>
//         <AcceptInvitationForm />
//       </div>
//     </div>
//   )
// }

// export default InvitationPanel
