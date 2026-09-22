import CircuitVisual from './CircuitVisual'
import RaceWeekend from './RaceWeekend'
import type { ApexRace } from '../../data/f1/f1Types'
import { useEffect, useState } from 'react'

type GridHeroProps = { race: ApexRace }

function getCountdown(target: string) {
  const remaining = Math.max(0, new Date(target).getTime() - Date.now())
  const totalMinutes = Math.floor(remaining / 60000)
  return { days: String(Math.floor(totalMinutes / 1440)).padStart(2, '0'), hours: String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, '0'), minutes: String(totalMinutes % 60).padStart(2, '0') }
}

function formatRaceDate(start: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(start)).toUpperCase()
}

function formatRaceTime(start: string) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(start)) + ' UTC'
}

function GridHero({ race }: GridHeroProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(race.raceStart))
  useEffect(() => {
    setCountdown(getCountdown(race.raceStart))
    const interval = window.setInterval(() => setCountdown(getCountdown(race.raceStart)), 60_000)
    return () => window.clearInterval(interval)
  }, [race.raceStart])

  return (
    <div className="grid-hero">
      <header className="grid-hero__masthead"><p className="grid-hero__eyebrow">APEX / Information system</p><p className="grid-hero__season">{race.season}</p></header>
      <div className="grid-hero__title-row"><h1 id="grid-title">THE GRID</h1><span className="grid-hero__index">01 / NOW</span></div>
      <div className="grid-hero__content">
        <section className="grid-race" aria-labelledby="next-race-title">
          <p id="next-race-title" className="grid-label">Next race</p><p className="grid-race__date">{formatRaceDate(race.raceStart)}</p><h2>{race.name}</h2>
          <div className="grid-race__location"><span>{race.round}</span><span>{race.city} / {race.circuit}</span></div>
        </section>
        <CircuitVisual circuit={race.circuit} circuitKey={race.circuitKey} />
        <section className="grid-countdown" aria-label="Race countdown">
          <p className="grid-label">Countdown</p><div className="grid-countdown__values">
            {Object.entries(countdown).map(([unit, value]) => <div key={unit} className="grid-countdown__unit"><strong>{value}</strong><span>{unit}</span></div>)}
          </div><p className="grid-countdown__note">Lights out / {formatRaceTime(race.raceStart)}</p>
        </section>
      </div>
      <RaceWeekend sessions={race.weekend} />
    </div>
  )
}

export default GridHero
