import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pco:progress:v1'

interface LessonProgress {
  watched: boolean
  positionSeconds: number
  updatedAt: string
}

type ProgressMap = Record<string, LessonProgress>

function readProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function writeProgress(progress: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => readProgress())

  useEffect(() => {
    writeProgress(progress)
  }, [progress])

  const isWatched = useCallback(
    (lessonSlug: string) => Boolean(progress[lessonSlug]?.watched),
    [progress],
  )

  const getPosition = useCallback(
    (lessonSlug: string) => progress[lessonSlug]?.positionSeconds ?? 0,
    [progress],
  )

  const updateProgress = useCallback((lessonSlug: string, positionSeconds: number, watched: boolean) => {
    setProgress((prev) => ({
      ...prev,
      [lessonSlug]: {
        watched: watched || Boolean(prev[lessonSlug]?.watched),
        positionSeconds,
        updatedAt: new Date().toISOString(),
      },
    }))
  }, [])

  const markWatched = useCallback((lessonSlug: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonSlug]: {
        watched: true,
        positionSeconds: prev[lessonSlug]?.positionSeconds ?? 0,
        updatedAt: new Date().toISOString(),
      },
    }))
  }, [])

  return { isWatched, getPosition, updateProgress, markWatched }
}
