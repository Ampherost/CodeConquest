// src/components/Chapter.tsx
import { FC } from "react"

export interface ChapterProps {
  id: string
  title: string
  index: number
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export const Chapter: FC<ChapterProps> = ({
  id,
  title,
  index,
  isSelected = false,
  onSelect,
}) => {
  return (
    <li
      className={`
        flex-1 
        border-b border-zinc-700 last:border-b-0
        ${isSelected ? "bg-zinc-700" : ""}
      `}
    >
      <button
        onClick={() => onSelect?.(id)}
        className="w-full h-full flex items-center justify-between px-4 py-2 hover:bg-zinc-700 transition"
      >
        <span className="text-zinc-100 font-medium">
          {index + 1}. {title}
        </span>
      </button>
    </li>
  )
}
