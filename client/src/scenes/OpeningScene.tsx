import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { CinematicSceneProps } from '../types/cinematic'

function OpeningScene({ isActive, overallProgress, sceneProgress }: CinematicSceneProps) {
  const metadataRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const titleReveal = gsap.utils.clamp(0, 1, (sceneProgress - 0.04) / 0.38)

    gsap.set(metadataRef.current, {
      autoAlpha: titleReveal,
      y: 10 * (1 - titleReveal),
    })
  }, [sceneProgress])

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10 text-center">
        <p
          ref={metadataRef}
          className="absolute left-1/2 top-[17%] -translate-x-1/2 text-xs font-medium uppercase tracking-[0.24em] text-(--apex-gray)"
        >
          Formula 1 / 2026
        </p>
      </div>
      <span className="sr-only">Active: {String(isActive)}. Overall progress: {overallProgress}. Scene progress: {sceneProgress}.</span>
    </div>
  )
}

export default OpeningScene
