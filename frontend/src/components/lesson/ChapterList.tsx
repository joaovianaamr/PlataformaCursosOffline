import type { Chapter } from '@/types/course'
import { formatTimestamp } from '@/lib/formatTimestamp'

interface ChapterListProps {
  chapters: Chapter[]
  activeChapterOrder: number | null
  isChapterWatched: (chapterOrder: number) => boolean
  onSelect: (chapter: Chapter) => void
}

export function ChapterList({ chapters, activeChapterOrder, isChapterWatched, onSelect }: ChapterListProps) {
  if (chapters.length === 0) return null

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface p-2">
      <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
        Cortes desta aula
      </p>
      {chapters.map((chapter) => {
        const active = chapter.order === activeChapterOrder
        const watched = isChapterWatched(chapter.order)
        return (
          <button
            key={chapter.order}
            type="button"
            onClick={() => onSelect(chapter)}
            className={`relative flex items-center gap-3 rounded-sm px-3 py-2 pl-4 text-left text-sm transition-colors ${
              active ? 'bg-accent/15 text-text' : 'text-text-muted hover:bg-surface-hover hover:text-text'
            }`}
          >
            {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />}
            <span className={`shrink-0 font-mono text-xs ${watched ? 'text-success' : active ? 'text-accent' : 'text-text-muted'}`}>
              {watched ? '✓' : formatTimestamp(chapter.startSeconds)}
            </span>
            <span>{chapter.title}</span>
          </button>
        )
      })}
    </div>
  )
}
