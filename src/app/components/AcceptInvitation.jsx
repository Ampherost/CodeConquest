'use client'

import { useState } from 'react'

export default function AcceptInvitation() {
    const [code, setCode] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [message, setMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/invitation/accept?code=${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })

            if (res.ok) {
                setMessage('Invitation accepted successfully!')
            } else {
                const errorData = await res.json()
                setMessage(errorData.message || 'Failed to accept invitation.')
            }
        } catch (err) {
            setMessage('An error occurred while accepting the invitation.')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <label className="text-sm font-medium">Enter your invitation code</label>
                <input
                    type="text"
                    name="invite_code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Accept Invitation
                </button>
            </form>
            {submitted && message && (
                <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
            )}
        </div>
    )
}
