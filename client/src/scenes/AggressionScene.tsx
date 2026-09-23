import type { CinematicSceneProps } from '../types/cinematic'

function AggressionScene({ sceneProgress }: CinematicSceneProps) {
  const progress = Math.min(1, Math.max(0, sceneProgress))
  const reveal = Math.min(1, progress * 2.2)
  const titleShift = (1 - progress) * 34 - progress * 48
  const chapterShift = (1 - progress) * -2 + progress * 4
  const metadataShift = (1 - progress) * 4 - progress * 3

  return (
    <div className="aggression-scene relative h-full w-full overflow-hidden">
      <div className="aggression-scene__wash" aria-hidden="true" />
      <div className="aggression-scene__chapter" style={{ opacity: 0.14 + reveal * 0.12, transform: `translate3d(0, ${chapterShift}%, 0)` }} aria-hidden="true">02</div>
      <div className="aggression-scene__header" style={{ opacity: 0.58 + reveal * 0.42, transform: `translate3d(0, ${metadataShift}%, 0)` }} aria-hidden="true">
        <span>02 / Red Bull Racing</span>
        <span>Cinematic Series</span>
      </div>
      <div className="aggression-scene__copy" style={{ transform: `translate3d(0, ${metadataShift}%, 0)` }}>
        <p className="aggression-scene__eyebrow">Red Bull</p>
        <p className="aggression-scene__index">Formula 1 / 2026</p>
      </div>
      <h2 className="aggression-scene__title" style={{ opacity: 0.2 + reveal * 0.8, transform: `translate3d(${titleShift}%, 0, 0) skewX(-7deg)` }}>
        Aggression
      </h2>
      <div className="aggression-scene__title-shadow" style={{ opacity: (0.2 + reveal * 0.8) * 0.24, transform: `translate3d(${titleShift + 1.2}%, 1.2%, 0) skewX(-7deg)` }} aria-hidden="true">
        Aggression
      </div>
      <div className="aggression-scene__speedline" style={{ opacity: reveal * 0.6, transform: `translate3d(${-progress * 20}%, 0, 0) scaleX(${0.45 + progress * 0.55})` }} aria-hidden="true" />
      <div className="aggression-scene__footer" style={{ opacity: 0.55 + reveal * 0.45, transform: `translate3d(0, ${metadataShift}%, 0)` }} aria-hidden="true">
        <span>Pressure / Instinct / Momentum</span>
        <span>Milton Keynes / UK</span>
      </div>
    </div>
  )
}

export default AggressionScene
