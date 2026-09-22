import { useEffect, useState, type CSSProperties } from 'react'
import { fetchConstructorStandings, fetchDriverStandings } from '../../data/f1/f1Api'
import type { ApexConstructorStanding, ApexDriverStanding } from '../../data/f1/f1Types'

function points(value: number) { return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(value) }

function DriverPortrait({ driver }: { driver: ApexDriverStanding }) {
  const [available, setAvailable] = useState(Boolean(driver.imageUrl))
  return <span className="championship-portrait" aria-hidden="true">
    {available && driver.imageUrl ? <img src={driver.imageUrl} alt="" onError={() => setAvailable(false)} /> : <span className="championship-portrait__fallback">01</span>}
  </span>
}

const alpha3ToAlpha2: Record<string, string> = { AUS: 'au', AUT: 'at', BEL: 'be', BRA: 'br', CAN: 'ca', CHN: 'cn', DEU: 'de', DNK: 'dk', ESP: 'es', FIN: 'fi', FRA: 'fr', GBR: 'gb', JPN: 'jp', MEX: 'mx', MCO: 'mc', NED: 'nl', NZL: 'nz', POL: 'pl', RUS: 'ru', SGP: 'sg', THA: 'th', USA: 'us' }

function CountryFlag({ code, nationality }: { code: string | null; nationality: string | null }) {
  const [available, setAvailable] = useState(Boolean(code))
  const normalized = code ? alpha3ToAlpha2[code.toUpperCase()] ?? code.toLowerCase() : null
  if (!available || !normalized) return <span className="championship-flag championship-flag--fallback" title={nationality ?? 'Nationality unavailable'}>APEX</span>
  return <span className="championship-flag"><img src={`https://flagcdn.com/${normalized}.svg`} alt={`${nationality ?? normalized} flag`} onError={() => setAvailable(false)} /></span>
}

function DriverRows({ standings }: { standings: ApexDriverStanding[] }) {
  return <div className="championship-rows">
    {standings.map((standing) => <div className="championship-row" key={standing.driverNumber}>
      <span className="championship-row__position">{String(standing.position).padStart(2, '0')}</span>
      <DriverPortrait driver={standing} />
      <div className="championship-row__identity"><strong>{standing.driver}</strong><span className="championship-row__meta"><CountryFlag code={standing.countryCode} nationality={standing.nationality} />{standing.team}</span></div>
      <span className="championship-row__points">{points(standing.points)} <small>PTS</small></span>
    </div>)}
  </div>
}

function ConstructorRows({ standings }: { standings: ApexConstructorStanding[] }) {
  return <div className="championship-rows championship-rows--constructors">
    {standings.map((standing) => <div className="championship-row" key={`${standing.position}-${standing.team}`}>
      <span className="championship-row__position">{String(standing.position).padStart(2, '0')}</span>
      <div className="championship-row__identity"><strong><span className="championship-team-mark" style={standing.teamColor ? { backgroundColor: standing.teamColor } : undefined} aria-hidden="true" />{standing.team}</strong></div>
      <span className="championship-row__points">{points(standing.points)} <small>PTS</small></span>
    </div>)}
  </div>
}

function ChampionshipSection() {
  const [drivers, setDrivers] = useState<ApexDriverStanding[] | null>(null)
  const [constructors, setConstructors] = useState<ApexConstructorStanding[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([fetchDriverStandings(), fetchConstructorStandings()])
      .then(([driverData, constructorData]) => { if (active) { setDrivers(driverData); setConstructors(constructorData) } })
      .catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [])

  const isLoading = !drivers || !constructors
  const isEmpty = !isLoading && (!drivers.length || !constructors.length)
  const leader = drivers?.[0]

  return <section className="championship-section" aria-labelledby="championship-title">
    <div className="championship-intro">
      <p className="championship-intro__kicker">02 / Championship</p>
      <h2 id="championship-title">Who leads<br />the grid?</h2>
      <p className="championship-intro__note">Current standings / Formula 1 2026</p>
    </div>
    {error ? <div className="championship-state" role="alert"><span>Championship</span><strong>STANDINGS UNAVAILABLE</strong><small>F1 data could not be reached. Please try again shortly.</small></div> : isLoading ? <div className="championship-state"><span>Championship</span><strong>LOADING STANDINGS</strong><small>Syncing the current driver and constructor order.</small></div> : isEmpty ? <div className="championship-state"><span>Championship</span><strong>NO STANDINGS YET</strong><small>No completed championship data is available.</small></div> : leader ? <div className="championship-content">
      <div className="championship-leader" style={leader.teamColor ? { '--leader-color': leader.teamColor } as CSSProperties : undefined}>
        <p className="championship-label">Championship leader</p><span className="championship-leader__position">{String(leader.position).padStart(2, '0')}</span>
        <h3>{leader.driver}</h3><p className="championship-leader__team">{leader.team}</p>
        <div className="championship-leader__points"><strong>{points(leader.points)}</strong><span>Points</span></div>
      </div>
      <section className="championship-drivers" aria-labelledby="drivers-title"><div className="championship-section-heading"><h3 id="drivers-title">Drivers</h3><span>Position / Driver / Team / Points</span></div><DriverRows standings={drivers} /></section>
      <section className="championship-constructors" aria-labelledby="constructors-title"><div className="championship-section-heading"><h3 id="constructors-title">Constructors</h3><span>Position / Team / Points</span></div><ConstructorRows standings={constructors} /></section>
    </div> : null}
  </section>
}

export default ChampionshipSection
