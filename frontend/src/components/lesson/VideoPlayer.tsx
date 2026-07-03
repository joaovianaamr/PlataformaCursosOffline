import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { buildVideoUrl } from '@/services/media'
import type { Chapter } from '@/types/course'

const SAVE_INTERVAL_SECONDS = 5
const WATCHED_THRESHOLD = 0.9

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void
}

interface VideoPlayerProps {
  videoUrl: string
  lessonSlug: string
  initialPositionSeconds: number
  chapters: Chapter[]
  onProgress: (positionSeconds: number, watched: boolean) => void
  onEnded: () => void
  onActiveChapterChange?: (chapterOrder: number | null) => void
  onChapterWatched?: (chapterOrder: number) => void
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(function VideoPlayer(
  { videoUrl, lessonSlug, initialPositionSeconds, chapters, onProgress, onEnded, onActiveChapterChange, onChapterWatched },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSavedRef = useRef(0)
  const activeChapterRef = useRef<number | null>(null)
  const watchedChaptersRef = useRef<Set<number>>(new Set())

  useImperativeHandle(ref, () => ({
    seekTo(seconds: number) {
      const video = videoRef.current
      if (!video) return
      video.currentTime = seconds
      video.play().catch(() => {})
    },
  }))

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (initialPositionSeconds > 0 && initialPositionSeconds < video.duration - 1) {
        video.currentTime = initialPositionSeconds
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSlug])

  useEffect(() => {
    activeChapterRef.current = null
    watchedChaptersRef.current = new Set()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSlug])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const now = video.currentTime

    if (chapters.length > 0) {
      const current = chapters.find((c) => now >= c.startSeconds && now < c.endSeconds) ?? null
      if (current?.order !== activeChapterRef.current) {
        activeChapterRef.current = current?.order ?? null
        onActiveChapterChange?.(current?.order ?? null)
      }
      for (const chapter of chapters) {
        if (now >= chapter.endSeconds && !watchedChaptersRef.current.has(chapter.order)) {
          watchedChaptersRef.current.add(chapter.order)
          onChapterWatched?.(chapter.order)
        }
      }
    }

    if (now - lastSavedRef.current >= SAVE_INTERVAL_SECONDS) {
      lastSavedRef.current = now
      const watched = video.duration > 0 && now / video.duration >= WATCHED_THRESHOLD
      onProgress(now, watched)
    }
  }

  return (
    <video
      ref={videoRef}
      key={lessonSlug}
      controls
      autoPlay
      className="w-full rounded-md border border-border bg-black"
      src={buildVideoUrl(videoUrl)}
      onTimeUpdate={handleTimeUpdate}
      onEnded={onEnded}
    />
  )
})
