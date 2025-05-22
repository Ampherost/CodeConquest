// src/components/ChapterList.tsx
import Link from "next/link"
import { FC } from "react"
//import { ChevronRightIcon } from "lucide-react"

export interface Chapter {
  /** your chapter‐slug / id */
  id: string
  title: string
}

export interface ChapterListProps {
  /** url prefix – e.g. "/modules/software-engineering/chapter" */
  basePath: string
  chapters: Chapter[]
  /** which chapter is currently active (optional) */
  selectedId?: string
}

const ChapterList: FC<ChapterListProps> = ({
  basePath,
  chapters,
  selectedId,
}) => (
  <ul className="flex flex-col h-full bg-zinc-800 rounded-lg overflow-hidden">
    {chapters.map((chap, idx) => {
      const isSelected = chap.id === selectedId
      return (
        <li
          key={chap.id}
          className={`
            flex-1
            border-b border-zinc-700 last:border-b-0
            ${isSelected ? "bg-zinc-700" : ""}
          `}
        >
          <Link
            href={`${basePath}/${chap.id}`}
            className="w-full h-full flex items-center justify-between px-4 py-2 hover:bg-zinc-700 transition"
          >
            <span className="text-zinc-100 font-medium">
              {idx + 1}. {chap.title}
            </span>
          </Link>
        </li>
      )
    })}
  </ul>
)

export default ChapterList