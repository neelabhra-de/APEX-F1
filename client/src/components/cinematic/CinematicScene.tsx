import type { PropsWithChildren } from 'react'
import type { CinematicSceneDefinition } from '../../types/cinematic'

interface CinematicSceneProps extends PropsWithChildren {
  scene: CinematicSceneDefinition
  isActive: boolean
}

function CinematicScene({ children, isActive, scene }: CinematicSceneProps) {
  return (
    <section
      aria-hidden={!isActive}
      aria-label={scene.name}
      className={`absolute inset-0 grid place-items-center px-6 sm:px-10 ${
        isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {children}
    </section>
  )
}

export default CinematicScene
