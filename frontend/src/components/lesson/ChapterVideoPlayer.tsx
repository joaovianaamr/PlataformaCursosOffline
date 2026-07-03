import { useEffect, useRef, useState } from 'react'
import { buildVideoUrl } from '@/services/media'
import { formatTimestamp } from '@/lib/formatTimestamp'
import type { Chapter } from '@/types/course'

interface ChapterVideoPlayerProps {
  videoUrl: string
  lessonSlug: string
  chapter: Chapter
  onChapterWatched: () => void
}

/**
 * Player "travado" num único corte: por baixo é o mesmo arquivo de vídeo da
 * aula inteira, mas os controles são próprios (sem <video controls> nativo)
 * pra mostrar tempo relativo (0 até a duração do corte) e impedir arrastar
 * pra antes do início ou depois do fim do corte designado.
 */
export function ChapterVideoPlayer({ videoUrl, lessonSlug, chapter, onChapterWatched }: ChapterVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const watchedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [relativeTime, setRelativeTime] = useState(0)

  const duration = Math.max(0, chapter.endSeconds - chapter.startSeconds)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    watchedRef.current = false
    setRelativeTime(0)

    const seekToStart = () => {
      video.currentTime = chapter.startSeconds
      video.play().catch(() => {})
    }
    if (video.readyState >= 1) {
      seekToStart()
      return
    }
    video.addEventListener('loadedmetadata', seekToStart, { once: true })
    return () => video.removeEventListener('loadedmetadata', seekToStart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.order])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const now = video.currentTime

    if (now >= chapter.endSeconds) {
      video.pause()
      if (now !== chapter.endSeconds) video.currentTime = chapter.endSeconds
      setRelativeTime(duration)
      if (!watchedRef.current) {
        watchedRef.current = true
        onChapterWatched()
      }
      return
    }
    if (now < chapter.startSeconds) {
      video.currentTime = chapter.startSeconds
      return
    }
    setRelativeTime(now - chapter.startSeconds)
  }

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const target = Math.min(Math.max(Number(e.target.value), 0), duration)
    video.currentTime = chapter.startSeconds + target
    setRelativeTime(target)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      el.requestFullscreen().catch(() => {})
    }
  }

  const pct = duration > 0 ? (relativeTime / duration) * 100 : 0

  return (
    <div ref={containerRef} className="flex flex-col gap-3 rounded-md border border-border bg-black p-3">
      <video
        ref={videoRef}
        key={lessonSlug}
        className="w-full rounded-sm bg-black"
        src={buildVideoUrl(videoUrl)}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 rounded-sm border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-text hover:border-accent/50 hover:bg-surface-hover"
        >
          {isPlaying ? 'Pausar' : 'Tocar'}
        </button>

        <span className="shrink-0 font-mono text-xs text-text-muted">
          {formatTimestamp(relativeTime)} / {formatTimestamp(duration)}
        </span>

        <input
          type="range"
          className="corte-seek h-1.5 min-w-[100px] flex-1"
          min={0}
          max={duration}
          step={0.1}
          value={relativeTime}
          onChange={handleScrub}
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
          }}
          aria-label="Posição no corte"
        />

        <button
          type="button"
          onClick={toggleMute}
          className="shrink-0 rounded-sm border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-text hover:border-accent/50 hover:bg-surface-hover"
        >
          {isMuted ? 'Som' : 'Mudo'}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="shrink-0 rounded-sm border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-text hover:border-accent/50 hover:bg-surface-hover"
        >
          Tela cheia
        </button>
      </div>
    </div>
  )
}
