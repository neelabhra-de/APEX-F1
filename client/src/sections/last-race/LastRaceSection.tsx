import { useEffect, useState } from 'react'
import { fetchLastRace } from '../../data/f1/f1Api'
import type { ApexLastRace, ApexLastRaceDriver } from '../../data/f1/f1Types'

function Flag({ code }: { code: string | null }) {
  if (!code) return <span className="last-race__flag last-race__flag--fallback">APEX</span>
  return <span className="last-race__flag"><img src={`https://flagcdn.com/${code.toLowerCase()}.svg`} alt={`${code} flag`} /></span>
}

function Portrait({ driver }: { driver: ApexLastRaceDriver }) {
  const [available, setAvailable] = useState(Boolean(driver.imageUrl))
  return <span className="last-race__portrait">{available && driver.imageUrl ? <img src={driver.imageUrl} alt="" onError={() => setAvailable(false)} /> : <span>01</span>}</span>
}

function dateLabel(value: string) { return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) }

function PodiumDriver({ driver, label, featured = false }: { driver: ApexLastRaceDriver; label: string; featured?: boolean }) {
  return <article className={`last-race__podium-driver${featured ? ' last-race__podium-driver--featured' : ''}`} style={driver.teamColor ? { '--last-race-team': driver.teamColor } as React.CSSProperties : undefined}>
    <span className="last-race__podium-position">{String(driver.position).padStart(2, '0')}</span>
    <Portrait driver={driver} />
    <div><p>{label}</p><h3>{driver.driver}</h3><span><Flag code={driver.countryCode} /> {driver.team}</span></div>
  </article>
}

export default function LastRaceSection() {
  const [race, setRace] = useState<ApexLastRace | null>(null)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => { let active = true; fetchLastRace().then((value) => active && setRace(value)).catch(() => active && setError(true)); return () => { active = false } }, [])
  return <section className="last-race-section" aria-labelledby="last-race-title">
    <div className="last-race__intro"><p>03 / Last Race</p><h2 id="last-race-title">What just<br />happened?</h2><span>Latest completed race / Formula 1 2026</span></div>
    {error ? <div className="last-race__state"><span>Last race</span><strong>RESULTS UNAVAILABLE</strong><small>F1 race data could not be reached. Please try again shortly.</small></div> : !race ? <div className="last-race__state"><span>Last race</span><strong>LOADING RESULTS</strong><small>Resolving the latest completed race classification.</small></div> : <div className="last-race__content">
      <div className="last-race__identity"><p className="last-race__eyebrow">{race.round ? `Round ${String(race.round).padStart(2, '0')}` : 'Round —'} / {race.country}</p><h3>{race.raceName.replace(/ Grand Prix/i, '')}<br /><em>Grand Prix</em></h3><div className="last-race__meta"><span>{race.circuit}</span><span>{race.location}</span><span>{dateLabel(race.raceDate)}</span></div></div>
      <div className="last-race__podium"><PodiumDriver driver={race.winner} label="Winner" featured /><div className="last-race__podium-support">{race.secondPlace && <PodiumDriver driver={race.secondPlace} label="Second" />}{race.thirdPlace && <PodiumDriver driver={race.thirdPlace} label="Third" />}</div></div>
      <div className="last-race__results"><div className="last-race__results-heading"><h3>Classification</h3><span>Pos / Driver / Team / Time</span></div><div className={`last-race__results-list${expanded ? ' is-expanded' : ''}`}>{race.results.map((result, index) => <div className="last-race__result" key={result.driverNumber} style={{ '--result-delay': `${Math.max(0, index - 2) * 35}ms` } as React.CSSProperties}><span>{String(result.position).padStart(2, '0')}</span><strong>{result.driver}</strong><small><Flag code={result.countryCode} />{result.team}</small><b>{result.time || result.status}</b></div>)}</div>{race.results.length > 3 && <button className="last-race__toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Show less' : 'View more'} <i>→</i></button>}</div>
    </div>}
  </section>
}
