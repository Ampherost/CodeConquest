'use client';

import React from 'react';

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  userEmail: string | null;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ open, onClose, userEmail }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-300 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">My Profile</h2>
        <button
          onClick={onClose}
          className="text-2xl font-bold text-zinc-500 hover:text-red-500"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 text-sm text-zinc-800 dark:text-zinc-100">
        {/* Password Section */}
        <div>
          <div className="text-xs uppercase text-zinc-500 mb-1">Password</div>
          <div className="flex justify-between items-center">
            <span>Update password</span>
            <button className="text-blue-500 hover:underline text-xs">Edit</button>
          </div>
        </div>

        {/* Email Section */}
        <div>
          <div className="text-xs uppercase text-zinc-500 mb-1">Email</div>
          <div className="flex justify-between items-center">
            <span>{userEmail || 'Not signed in'}</span>
            <button className="text-blue-500 hover:underline text-xs">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
