import type { ComponentType } from 'react'
import HeroCarCanvas from './HeroCarCanvas'
import AggressionScene from '../../scenes/AggressionScene'
import AmbitionScene from '../../scenes/AmbitionScene'
import LegacyScene from '../../scenes/LegacyScene'
import OpeningScene from '../../scenes/OpeningScene'
import PrecisionScene from '../../scenes/PrecisionScene'
import FinalRevealScene from '../../scenes/FinalRevealScene'
import { useCinematicScroll } from '../../hooks/useCinematicScroll'
import type { CinematicSceneDefinition, CinematicSceneId, CinematicSceneProps } from '../../types/cinematic'
import CinematicScene from './CinematicScene'
import SceneProgress from './SceneProgress'

const SCENES: readonly CinematicSceneDefinition[] = [
  { id: 'opening', index: 0, name: 'Formula 1 / 2026', range: { start: 0, end: 0.1 }, enabled: true },
  { id: 'legacy', index: 1, name: 'Ferrari / Legacy', range: { start: 0.1, end: 0.28 }, enabled: true },
  { id: 'aggression', index: 2, name: 'Red Bull / Aggression', range: { start: 0.28, end: 0.46 }, enabled: true },
  { id: 'ambition', index: 3, name: 'McLaren / Ambition', range: { start: 0.46, end: 0.64 }, enabled: true },
  { id: 'precision', index: 4, name: 'Mercedes / Precision', range: { start: 0.64, end: 0.82 }, enabled: true },
  { id: 'final', index: 5, name: 'APEX', subtitle: 'Final reveal', range: { start: 0.82, end: 1 }, enabled: true },
]

const sceneComponents: Record<CinematicSceneId, ComponentType<CinematicSceneProps>> = {
  opening: OpeningScene,
  final: FinalRevealScene,
  precision: PrecisionScene,
  aggression: AggressionScene,
  legacy: LegacyScene,
  ambition: AmbitionScene,
}

function CinematicExperience() {
  const { activeSceneIndex, overallProgress, sceneProgress, scrollRef } = useCinematicScroll(SCENES)
  const activeScene = SCENES.find((scene) => scene.index === activeSceneIndex)

  if (!activeScene) {
    return null
  }

  return (
    <div ref={scrollRef} className="relative h-[600svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-(--apex-black)">
        <HeroCarCanvas sceneProgress={overallProgress} className="z-0" />
        {SCENES.map((scene) => {
          const SceneComponent = sceneComponents[scene.id]
          const isActive = scene.index === activeSceneIndex

          return (
            <CinematicScene key={scene.id} isActive={isActive} scene={scene}>
              <SceneComponent isActive={isActive} overallProgress={overallProgress} sceneProgress={isActive ? sceneProgress : 0} />
            </CinematicScene>
          )
        })}
        <SceneProgress activeScene={activeScene} overallProgress={overallProgress} sceneProgress={sceneProgress} />
      </div>
    </div>
  )
}

export default CinematicExperience
