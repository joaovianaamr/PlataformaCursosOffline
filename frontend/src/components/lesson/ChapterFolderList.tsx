import { Link } from 'react-router-dom'
import type { Chapter } from '@/types/course'
import { formatTimestamp } from '@/lib/formatTimestamp'

interface ChapterFolderListProps {
  basePath: string
  chapters: Chapter[]
  isChapterWatched: (chapterSlug: string) => boolean
}

export function ChapterFolderList({ basePath, chapters, isChapterWatched }: ChapterFolderListProps) {
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-surface">
      {chapters.map((chapter) => {
        const watched = isChapterWatched(chapter.slug)
        return (
          <li key={chapter.slug} className="relative">
            <Link
              to={`${basePath}/${chapter.slug}`}
              className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface-hover"
            >
              <span className="absolute inset-y-0 left-0 w-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className={`w-7 shrink-0 text-right font-mono text-sm ${watched ? 'text-success' : 'text-text-muted'}`}>
                {watched ? '✓' : String(chapter.order).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1 text-text">{chapter.title}</span>
              <span className="shrink-0 font-mono text-xs text-text-muted">{formatTimestamp(chapter.startSeconds)}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
