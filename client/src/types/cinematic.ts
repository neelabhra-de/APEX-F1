export type CinematicSceneId =
  | 'opening'
  | 'final'
  | 'precision'
  | 'aggression'
  | 'legacy'
  | 'ambition'

export interface CinematicSceneDefinition {
  id: CinematicSceneId
  index: number
  name: string
  subtitle?: string
  range: { start: number; end: number }
  enabled: boolean
}

export interface CinematicSceneProps {
  overallProgress: number
  sceneProgress: number
  isActive: boolean
}
