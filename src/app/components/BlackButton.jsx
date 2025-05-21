'use client'

export default function BlackButton({ text, onClick }) {
  return (
    <button
      className="bg-black text-white py-2 px-4 rounded"
      onClick={onClick ?? (() => {})}
    >
      {text}
    </button>
  )
}
