'use client'

import React from 'react'
import AcceptInvitationForm from '../notificationPanel/AcceptInvitationForm'

interface Props {
  open: boolean
  onClose: () => void
}

const InvitationPanel: React.FC<Props> = ({ open, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
        <h2 className="text-lg font-semibold text-white">Join via Code</h2>
        <button
          onClick={onClose}
          className="text-xl text-zinc-400 hover:text-red-500"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-sm text-zinc-400 mb-2">
          Enter a valid invitation code from your company.
        </p>
        <AcceptInvitationForm />
      </div>
    </div>
  )
}

export default InvitationPanel
