'use client';

import React from 'react';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  {
    company: 'Sony™',
    date: 'July 20, 2025',
  },
  {
    company: 'Google™',
    date: 'May 5th, 2001',
  },
];

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-300 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Invitations:</h2>
        <button
          onClick={onClose}
          className="text-2xl font-bold text-zinc-500 hover:text-red-500"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Invitations */}
      <div className="p-6 space-y-6">
        {notifications.map((invite, index) => (
          <div key={index} className="flex justify-between items-center gap-4">
            {/* Left side */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">🕒</div>
              <div>
                <div className="font-semibold text-sm text-zinc-900 dark:text-white">Pending Invite</div>
                <div className="text-xs text-zinc-500">From: {invite.company}</div>
              </div>
            </div>

            {/* Right side */}
            <div className="text-right">
              <div className="text-sm mb-2 text-zinc-800 dark:text-zinc-200">{invite.date}</div>
              <div className="flex gap-2">
                <button className="bg-zinc-800 text-white px-3 py-1 rounded-md text-sm hover:bg-zinc-700">Accept</button>
                <button className="bg-zinc-800 text-white px-3 py-1 rounded-md text-sm hover:bg-zinc-700">Deny</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
