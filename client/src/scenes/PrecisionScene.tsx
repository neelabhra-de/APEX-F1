import type { CinematicSceneProps } from '../types/cinematic'

function PrecisionScene({ isActive, overallProgress, sceneProgress }: CinematicSceneProps) {
  const progress = Math.min(1, Math.max(0, sceneProgress))
  const arrival = Math.min(1, progress / 0.32)
  const silence = Math.min(1, Math.max(0, (progress - 0.78) / 0.22))
  const titleOpacity = (0.18 + arrival * 0.74) * (1 - silence * 0.92)
  const titleX = (1 - arrival) * 5 - silence * 2
  const titleScale = 0.975 + arrival * 0.025 - silence * 0.02
  const metadataY = (1 - arrival) * 8 - silence * 3
  const chapterY = (1 - arrival) * -3 + silence * 2

  return (
    <div className="precision-scene relative h-full w-full overflow-hidden">
      <div className="precision-scene__wash" aria-hidden="true" />
      <div className="precision-scene__chapter" style={{ opacity: (0.05 + arrival * 0.12) * (1 - silence * 0.86), transform: `translate3d(0, ${chapterY}%, 0)` }} aria-hidden="true">04</div>
      <div className="precision-scene__header" style={{ opacity: (0.45 + arrival * 0.4) * (1 - silence * 0.92), transform: `translate3d(0, ${metadataY}%, 0)` }} aria-hidden="true">
        <span>04 / Mercedes</span>
        <span>Cinematic Series</span>
      </div>
      <div className="precision-scene__copy" style={{ opacity: (0.5 + arrival * 0.4) * (1 - silence * 0.92), transform: `translate3d(0, ${metadataY}%, 0)` }}>
        <p className="precision-scene__eyebrow">Mercedes</p>
        <p className="precision-scene__index">Formula 1 / 2026</p>
      </div>
      <h2 className="precision-scene__title" style={{ opacity: titleOpacity, transform: `translate3d(${titleX}%, 0, 0) scale(${titleScale})` }}>Precision</h2>
      <div className="precision-scene__title-shadow" style={{ opacity: titleOpacity * 0.28, transform: `translate3d(${titleX - 0.55}%, 1.1%, 0) scale(${titleScale})` }} aria-hidden="true">Precision</div>
      <div className="precision-scene__rule" style={{ opacity: arrival * 0.62 * (1 - silence), transform: `scaleX(${0.48 + arrival * 0.52})` }} aria-hidden="true" />
      <div className="precision-scene__footer" style={{ opacity: (0.45 + arrival * 0.38) * (1 - silence * 0.94), transform: `translate3d(0, ${metadataY}%, 0)` }} aria-hidden="true">
        <span>Control / Engineering / Discipline</span>
        <span>Brackley / UK</span>
      </div>
      <span className="sr-only">Active: {String(isActive)}. Overall progress: {overallProgress}. Scene progress: {sceneProgress}.</span>
    </div>
  )
}

export default PrecisionScene
