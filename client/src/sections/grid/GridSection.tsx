import GridHero from './GridHero'
import { fetchNextRace } from '../../data/f1/f1Api'
import type { ApexRace } from '../../data/f1/f1Types'
import { useEffect, useState } from 'react'

function GridSection() {
  const [race, setRace] = useState<ApexRace | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let active = true
    fetchNextRace().then((nextRace) => { if (active) setRace(nextRace) }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [])
  return <section className="grid-section" aria-labelledby="grid-title"><div className="grid-section__transition" aria-hidden="true"><span>Beyond the flag</span><i /><span>Into the grid</span></div>{race ? <GridHero race={race} /> : <div className="grid-state" role={error ? 'alert' : undefined}><span className="grid-state__label">The grid</span><strong>{error ? 'F1 DATA UNAVAILABLE' : 'LOADING NEXT RACE'}</strong><i /><small>{error ? 'We could not reach the race calendar. Please try again shortly.' : 'Syncing the 2026 calendar / race sessions'}</small></div>}</section>
}

export default GridSection
