"use client";
import { useState } from "react";
import generateCode from "@/app/helper/generateCode";

export default function InvitationForm({ employeerId }) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    position: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const inviteCode = generateCode();

    const payload = {
      invite_code: inviteCode,
      business_user_id: employeerId,
      notes: formData.notes,
      position: formData.position,
      email: formData.email,
      full_name: formData.fullName,
    };

    const res = await fetch("/api/invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { error } = await res.json();
      alert("Error creating invitation: " + error);
      setSubmitted(false);
      return;
    }

    alert("Invitation created successfully!");
    setSubmitted(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 text-black">
      <div className="bg-white p-6 rounded-lg w-[300px] shadow-md">
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm resize-none h-20 text-black"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button type="button" className="text-sm text-black">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitted}
              className={`px-4 py-2 rounded text-sm transition duration-200 ${
                submitted
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-black text-white"
              }`}
            >
              {submitted ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
