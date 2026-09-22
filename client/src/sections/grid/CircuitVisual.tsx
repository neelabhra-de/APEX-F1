import { circuitVisuals } from '../../data/f1/circuits/circuitVisuals'

type CircuitVisualProps = { circuit: string; circuitKey: number }

function CircuitVisual({ circuit, circuitKey }: CircuitVisualProps) {
  const visual = circuitVisuals[circuitKey]
  const label = visual ? `Circuit / ${visual.distance}` : 'Circuit visual / Geometry unavailable'
  return (
    <div className={`grid-circuit${visual ? '' : ' grid-circuit--unavailable'}`} aria-label={visual ? `Circuit outline for ${visual.name}` : `Circuit geometry unavailable for ${circuit}`}>
      <span className="grid-circuit__label">{label}</span>
      {visual ? <>
        <svg className="grid-circuit__svg" viewBox="0 0 760 500" role="img" aria-hidden="true">
          <path className="grid-circuit__shadow" pathLength="1" d={visual.trackPath} />
          <path className="grid-circuit__track" pathLength="1" d={visual.trackPath} />
          <path className="grid-circuit__start" d={visual.startPath} />
          <circle className="grid-circuit__marker" cx={visual.marker[0]} cy={visual.marker[1]} r="5" />
        </svg>
        <span className="grid-circuit__coordinate grid-circuit__coordinate--one">{visual.coordinates[0]}</span>
        <span className="grid-circuit__coordinate grid-circuit__coordinate--two">{visual.coordinates[1]}</span>
      </> : <span className="grid-circuit__fallback">Geometry unavailable</span>}
    </div>
  )
}

export default CircuitVisual
