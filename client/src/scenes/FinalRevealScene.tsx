import type { CSSProperties } from 'react'
import type { CinematicSceneProps } from '../types/cinematic'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

const identities = [
  { label: 'Legacy', number: '01', color: '#7b1720', x: -34, y: -25, scale: 1.18 },
  { label: 'Aggression', number: '02', color: '#294d8c', x: 29, y: -20, scale: 0.82 },
  { label: 'Ambition', number: '03', color: '#b9521d', x: -29, y: 23, scale: 1.04 },
  { label: 'Precision', number: '04', color: '#9baab0', x: 28, y: 25, scale: 0.86 },
] as const

function FinalRevealScene({ sceneProgress }: CinematicSceneProps) {
  const progress = clamp(sceneProgress)
  const memoryReveal = clamp((progress - 0.16) / 0.15)
  const convergence = clamp((progress - 0.46) / 0.27)
  const memoryOpacity = memoryReveal * (1 - convergence * 0.98)
  const numberOpacity = memoryReveal * (1 - convergence * 1.25)
  const silence = clamp((progress - 0.69) / 0.08) * (1 - clamp((progress - 0.82) / 0.05))
  const apexAssembly = clamp((progress - 0.81) / 0.13)
  const taglineReveal = clamp((progress - 0.94) / 0.06)
  const traceOpacity = memoryReveal * (1 - convergence) * 0.38
  const apexOffsets = [-1.55, -0.52, 0.52, 1.55]

  return (
    <div className="final-reveal relative z-10 h-full w-full overflow-hidden" style={{ '--trace-opacity': traceOpacity } as CSSProperties}>
      <div className="final-reveal__neutral" style={{ opacity: 0.58 + silence * 0.42 + apexAssembly * 0.32 }} aria-hidden="true" />
      <div className="final-reveal__traces" style={{ opacity: traceOpacity }} aria-hidden="true">
        <span className="final-reveal__trace final-reveal__trace--legacy" />
        <span className="final-reveal__trace final-reveal__trace--aggression" />
        <span className="final-reveal__trace final-reveal__trace--ambition" />
        <span className="final-reveal__trace final-reveal__trace--precision" />
      </div>
      <div className="final-reveal__memories" aria-hidden="true">
        {identities.map((identity) => {
          const x = identity.x * (1 - convergence)
          const y = identity.y * (1 - convergence)
          const scale = identity.scale - convergence * (identity.scale - 0.16)
          const wordStyle = { color: identity.color, opacity: memoryOpacity, transform: `translate3d(${x}vw, ${y}vh, 0) scale(${scale})` }
          const numberStyle = { color: identity.color, opacity: numberOpacity * 0.72, transform: `translate3d(${x * 1.08}vw, ${y * 1.08}vh, 0) scale(${0.8 + scale * 0.28})` }

          return (
            <div className="final-reveal__memory" key={identity.label}>
              <span className="final-reveal__memory-number" style={numberStyle}>{identity.number}</span>
              <span className="final-reveal__memory-word" style={wordStyle}>{identity.label}</span>
            </div>
          )
        })}
      </div>
      <div className="final-reveal__pause" style={{ opacity: silence }} aria-hidden="true" />
      <div className="final-reveal__identity" style={{ opacity: apexAssembly, transform: `translate3d(0, ${(1 - apexAssembly) * 1.5}rem, 0) scale(${0.94 + apexAssembly * 0.06})` }}>
        <h1 className="final-reveal__apex" aria-label="APEX">
          {'APEX'.split('').map((letter, index) => (
            <span key={letter} style={{ transform: `translate3d(${(apexOffsets[index] ?? 0) * (1 - apexAssembly)}rem, 0, 0)` }}>{letter}</span>
          ))}
        </h1>
        <p className="final-reveal__tagline" style={{ opacity: taglineReveal, transform: `translate3d(0, ${(1 - taglineReveal) * 0.6}rem, 0)` }}>The race, beyond the flag.</p>
        <p className="final-reveal__identifier" style={{ opacity: taglineReveal * 0.7 }}>Formula 1 / 2026 · Cinematic experience</p>
      </div>
    </div>
  )
}

export default FinalRevealScene
