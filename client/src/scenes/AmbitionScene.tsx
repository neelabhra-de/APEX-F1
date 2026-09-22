import type { CinematicSceneProps } from '../types/cinematic'

function AmbitionScene({ isActive, overallProgress, sceneProgress }: CinematicSceneProps) {
  const progress = Math.min(1, Math.max(0, sceneProgress))
  const reveal = Math.min(1, progress * 2.2)
  const titleShift = (1 - progress) * 8 + progress * 12
  const chapterShift = (1 - progress) * -3 + progress * 2
  const metadataShift = (1 - progress) * 8 - progress * 3

  return (
    <div className="ambition-scene relative h-full w-full overflow-hidden">
      <div className="ambition-scene__wash" aria-hidden="true" />
      <div className="ambition-scene__chapter" style={{ opacity: 0.12 + reveal * 0.12, transform: `translate3d(0, ${chapterShift}%, 0)` }} aria-hidden="true">03</div>
      <div className="ambition-scene__header" style={{ opacity: 0.58 + reveal * 0.42, transform: `translate3d(0, ${metadataShift}%, 0)` }} aria-hidden="true">
        <span>03 / McLaren Racing</span>
        <span>Cinematic Series</span>
      </div>
      <div className="ambition-scene__copy" style={{ transform: `translate3d(0, ${metadataShift}%, 0)` }}>
        <p className="ambition-scene__eyebrow">McLaren</p>
        <p className="ambition-scene__index">Formula 1 / 2026</p>
      </div>
      <h2 className="ambition-scene__title" style={{ opacity: 0.2 + reveal * 0.8, transform: `translate3d(${titleShift}%, 0, 0) scale(${0.92 + reveal * 0.08})` }}>
        Ambition
      </h2>
      <div className="ambition-scene__title-shadow" style={{ opacity: (0.2 + reveal * 0.8) * 0.25, transform: `translate3d(${titleShift - 1.2}%, 1.5%, 0) scale(${0.92 + reveal * 0.08})` }} aria-hidden="true">
        Ambition
      </div>
      <div className="ambition-scene__trajectory" style={{ opacity: reveal * 0.72, transform: `scaleX(${0.3 + progress * 0.7})` }} aria-hidden="true" />
      <div className="ambition-scene__footer" style={{ opacity: 0.58 + reveal * 0.42, transform: `translate3d(0, ${metadataShift}%, 0)` }} aria-hidden="true">
        <span>Progress / Pace / Purpose</span>
        <span>Woking / UK</span>
      </div>
      <span className="sr-only">Active: {String(isActive)}. Overall progress: {overallProgress}. Scene progress: {sceneProgress}.</span>
    </div>
  )
}

export default AmbitionScene
