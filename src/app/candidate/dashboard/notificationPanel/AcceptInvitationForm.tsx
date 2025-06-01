'use client'

import { useState } from 'react'

interface Props {
  onAccepted: () => void;  
}

export default function AcceptInvitationForm({ onAccepted }: Props) {
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setMessage('')

    try {
      const res = await fetch('/api/invitation/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const result = await res.json()
      if (res.ok) {
        setMessage('Invitation accepted successfully!')
        onAccepted()
      } else {
        setMessage(result.error || 'Failed to accept invitation.')
      }
    } catch {
      setMessage('An error occurred while accepting the invitation.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-4">
      <label className="text-sm font-medium text-zinc-300">Enter your invitation code</label>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border border-zinc-600 bg-zinc-800 px-3 py-2 rounded text-white"
        placeholder="e.g., 12345-XYZ"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Accept Invitation
      </button>
      {submitted && message && (
        <p className="text-sm text-zinc-300 mt-2">{message}</p>
      )}
    </form>
  )
}
