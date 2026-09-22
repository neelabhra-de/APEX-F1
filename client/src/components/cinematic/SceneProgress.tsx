import type { CinematicSceneDefinition } from '../../types/cinematic'

interface SceneProgressProps {
  activeScene: CinematicSceneDefinition
  overallProgress: number
  sceneProgress: number
}

function SceneProgress({ activeScene, overallProgress, sceneProgress }: SceneProgressProps) {
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <aside className="absolute bottom-6 left-6 z-10 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[var(--apex-gray)] sm:bottom-10 sm:left-10">
      <p>Overall progress: {overallProgress.toFixed(2)}</p>
      <p>Active scene: {activeScene.name}</p>
      <p>Scene progress: {sceneProgress.toFixed(2)}</p>
      <p>{String(activeScene.index + 1).padStart(2, '0')} / 06</p>
    </aside>
  )
}

export default SceneProgress
