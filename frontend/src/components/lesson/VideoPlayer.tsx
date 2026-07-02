import { useEffect, useRef } from 'react'
import { buildVideoUrl } from '@/services/media'

const SAVE_INTERVAL_SECONDS = 5
const WATCHED_THRESHOLD = 0.9

interface VideoPlayerProps {
  videoUrl: string
  lessonSlug: string
  initialPositionSeconds: number
  onProgress: (positionSeconds: number, watched: boolean) => void
  onEnded: () => void
}

export function VideoPlayer({ videoUrl, lessonSlug, initialPositionSeconds, onProgress, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSavedRef = useRef(0)

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

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const now = video.currentTime
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
}
