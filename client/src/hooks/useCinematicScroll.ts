import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'
import type { CinematicSceneDefinition } from '../types/cinematic'

gsap.registerPlugin(ScrollTrigger)

interface CinematicScrollSnapshot {
  overallProgress: number
  activeSceneIndex: number
  sceneProgress: number
}

interface UseCinematicScrollResult extends CinematicScrollSnapshot {
  scrollRef: RefObject<HTMLDivElement | null>
  reducedMotion: boolean
}

const PROGRESS_STEP = 0.01

function getSnapshot(
  progress: number,
  scenes: readonly CinematicSceneDefinition[],
): CinematicScrollSnapshot {
  const enabledScenes = scenes.filter((scene) => scene.enabled)
  const activeScene =
    enabledScenes.find(
      (scene) => progress >= scene.range.start && progress < scene.range.end,
    ) ?? enabledScenes.at(-1)

  if (!activeScene) {
    return { overallProgress: progress, activeSceneIndex: 0, sceneProgress: 0 }
  }

  const sceneProgress = Math.min(
    1,
    Math.max(
      0,
      (progress - activeScene.range.start) /
        (activeScene.range.end - activeScene.range.start),
    ),
  )

  return { overallProgress: progress, activeSceneIndex: activeScene.index, sceneProgress }
}

export function useCinematicScroll(
  scenes: readonly CinematicSceneDefinition[],
): UseCinematicScrollResult {
  const scrollRef = useRef<HTMLDivElement>(null)
  const initialSnapshot = getSnapshot(0, scenes)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [snapshot, setSnapshot] = useState(initialSnapshot)
  const snapshotRef = useRef(initialSnapshot)
  const frameRef = useRef<number | null>(null)
  const pendingProgressRef = useRef(0)

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement || reducedMotion) {
      setSnapshot(initialSnapshot)
      snapshotRef.current = initialSnapshot
      return undefined
    }

    const publishProgress = (progress: number, force = false) => {
      const nextSnapshot = getSnapshot(progress, scenes)
      const previousSnapshot = snapshotRef.current
      const hasSceneChanged = nextSnapshot.activeSceneIndex !== previousSnapshot.activeSceneIndex
      const hasMeaningfulProgressChange =
        Math.abs(nextSnapshot.overallProgress - previousSnapshot.overallProgress) >= PROGRESS_STEP ||
        Math.abs(nextSnapshot.sceneProgress - previousSnapshot.sceneProgress) >= PROGRESS_STEP

      if (force || hasSceneChanged || hasMeaningfulProgressChange) {
        snapshotRef.current = nextSnapshot
        setSnapshot(nextSnapshot)
      }
    }

    const requestProgressUpdate = (progress: number) => {
      pendingProgressRef.current = progress

      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        publishProgress(pendingProgressRef.current)
      })
    }

    let cinematicTrigger: ScrollTrigger | null = null
    const context = gsap.context(() => {
      cinematicTrigger = ScrollTrigger.create({
        trigger: scrollElement,
        start: 'top top',
        // The sticky viewport consumes one viewport of the section. Deriving the
        // travel distance explicitly keeps progress reversible at both boundaries
        // across resize and browser scroll restoration.
        end: () => `+=${Math.max(1, scrollElement.offsetHeight - window.innerHeight)}`,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => requestProgressUpdate(trigger.progress),
        onRefresh: (trigger) => publishProgress(trigger.progress, true),
      })
    }, scrollElement)

    const syncToScrollPosition = () => {
      if (cinematicTrigger) publishProgress(cinematicTrigger.progress, true)
    }

    // Browser scroll restoration can settle after React's layout effects. Refresh once
    // after all pinned sections exist, then read the trigger's actual progress.
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh()
      syncToScrollPosition()
    }, 0)
    window.addEventListener('pageshow', syncToScrollPosition)

    return () => {
      window.clearTimeout(refreshTimer)
      window.removeEventListener('pageshow', syncToScrollPosition)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      context.revert()
    }
  }, [reducedMotion, scenes])

  return { scrollRef, ...snapshot, reducedMotion }
}
