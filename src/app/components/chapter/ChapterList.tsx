// src/components/ChapterList.tsx
import { FC } from "react"
import { Chapter, ChapterProps } from "./Chapter"

export interface ChapterListProps {
  chapters: Array<Pick<ChapterProps, "id" | "title">>
  selectedId?: string
  onSelect?: (id: string) => void
}

export const ChapterList: FC<ChapterListProps> = ({
  chapters,
  selectedId,
  onSelect,
}) => (
  <ul className="flex flex-col h-full bg-zinc-800 rounded-lg overflow-hidden">
    {chapters.map((chap, idx) => (
      <Chapter
        key={chap.id}
        id={chap.id}
        title={chap.title}
        index={idx}
        isSelected={chap.id === selectedId}
        onSelect={onSelect}
      />
    ))}
  </ul>
)

