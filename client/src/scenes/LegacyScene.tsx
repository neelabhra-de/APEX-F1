import type { CinematicSceneProps } from '../types/cinematic'

function LegacyScene({ isActive, overallProgress, sceneProgress }: CinematicSceneProps) {
  const reveal = Math.min(1, Math.max(0, sceneProgress))
  const titleOpacity = Math.min(1, 0.24 + reveal * 0.76)
  const titleShift = (1 - reveal) * 12 - reveal * 4
  const titleScale = 0.94 + reveal * 0.06
  const chapterShift = (1 - reveal) * 4 + reveal * 2
  const metadataShift = (1 - reveal) * 14 - reveal * 4

  return (
    <div className="legacy-scene relative h-full w-full overflow-hidden">
      <div className="legacy-scene__wash" aria-hidden="true" />
      <div className="legacy-scene__chapter" style={{ opacity: 0.18 + reveal * 0.12, transform: `translate3d(0, ${chapterShift}%, 0)` }} aria-hidden="true">
        01
      </div>
      <div className="legacy-scene__header" style={{ opacity: 0.55 + reveal * 0.45, transform: `translate3d(0, ${metadataShift}%, 0)` }} aria-hidden="true">
        <span>01 / Scuderia Ferrari</span>
        <span>Cinematic Series</span>
      </div>
      <div className="legacy-scene__copy" style={{ transform: `translate3d(0, ${metadataShift}%, 0)` }}>
        <p className="legacy-scene__eyebrow">Ferrari</p>
        <p className="legacy-scene__index">01 / Legacy</p>
      </div>
      <h2
        className="legacy-scene__title"
        style={{ opacity: titleOpacity, transform: `translate3d(0, ${titleShift}%, 0) scale(${titleScale})` }}
      >
        Legacy
      </h2>
      <div className="legacy-scene__title-shadow" style={{ opacity: titleOpacity * 0.28, transform: `translate3d(${reveal * 1.5}%, ${titleShift + 2}%, 0) scale(${titleScale * 1.015})` }} aria-hidden="true">
        Legacy
      </div>
      <div className="legacy-scene__footer" style={{ opacity: 0.58 + reveal * 0.42, transform: `translate3d(0, ${metadataShift}%, 0)` }} aria-hidden="true">
        <span>Formula 1 / 2026</span>
        <span>Maranello / Italia</span>
      </div>
      <span className="sr-only">Active: {String(isActive)}. Overall progress: {overallProgress}. Scene progress: {sceneProgress}.</span>
    </div>
  )
}

export default LegacyScene
