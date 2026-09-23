import { env } from '../config/env.js'
import type { F1DriverStanding, F1LastRace, F1LastRaceDriver, F1Meeting, F1NextRace, F1Session, F1TeamStanding, OpenF1Driver, OpenF1DriverStanding, OpenF1Meeting, OpenF1Session, OpenF1SessionResult, OpenF1TeamStanding } from '../types/f1.js'

const OPENF1_BASE = 'https://api.openf1.org/v1'
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { value: unknown; expiresAt: number }>()
const DRIVER_COUNTRY_CODES: Record<number, string> = { 1: 'GB', 3: 'NL', 5: 'BR', 6: 'FR', 10: 'FR', 11: 'MX', 12: 'IT', 14: 'ES', 16: 'MC', 18: 'CA', 22: 'JP', 23: 'TH', 27: 'DE', 30: 'NZ', 31: 'FR', 41: 'SE', 43: 'AR', 44: 'GB', 55: 'ES', 63: 'GB', 77: 'FI', 81: 'AU', 87: 'GB' }

export class OpenF1Error extends Error { statusCode = 502; constructor(message: string) { super(message); this.name = 'OpenF1Error' } }

const RETRYABLE_STATUS = new Set([429, 502, 503, 504])
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
async function openF1<T>(path: string): Promise<T> {
  const now = Date.now(); const hit = cache.get(path)
  if (hit && hit.expiresAt > now) return hit.value as T
  let lastError = 'network error'
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${OPENF1_BASE}${path}`, { headers: { accept: 'application/json' } })
      if (response.ok) { const value = await response.json() as T; cache.set(path, { value, expiresAt: Date.now() + CACHE_TTL_MS }); return value }
      lastError = `OpenF1 returned ${response.status} for ${path}`
      if (!RETRYABLE_STATUS.has(response.status)) break
    } catch (error) { lastError = `OpenF1 request failed: ${error instanceof Error ? error.message : 'network error'}` }
    if (attempt < 2) await wait(180 * (attempt + 1))
  }
  throw new OpenF1Error(lastError)
}
function isCancelled(meeting: OpenF1Meeting) { return `${meeting.meeting_name} ${meeting.meeting_official_name}`.toLowerCase().includes('cancel') }
function sortByStart<T extends { date_start: string }>(a: T, b: T) { return new Date(a.date_start).getTime() - new Date(b.date_start).getTime() }
function normalizeMeeting(meeting: OpenF1Meeting, round: number | null): F1Meeting { return { meetingKey: meeting.meeting_key, round, name: meeting.meeting_name, officialName: meeting.meeting_official_name, country: meeting.country_name, location: meeting.location, circuit: meeting.circuit_short_name, circuitKey: meeting.circuit_key, start: meeting.date_start, end: meeting.date_end, timezoneOffset: meeting.gmt_offset ?? null, year: meeting.year } }
function normalizeSession(session: OpenF1Session): F1Session { return { sessionKey: session.session_key, meetingKey: session.meeting_key, name: session.session_name, type: session.session_type, start: session.date_start, end: session.date_end } }

export async function getSeason(year = env.season): Promise<F1Meeting[]> {
  const meetings = (await openF1<OpenF1Meeting[]>(`/meetings?year=${year}`)).filter((meeting) => !isCancelled(meeting)).sort(sortByStart)
  const grandsPrix = meetings.filter((meeting) => /grand prix/i.test(meeting.meeting_name))
  return meetings.map((meeting) => normalizeMeeting(meeting, Math.max(0, grandsPrix.indexOf(meeting) + 1) || null))
}
export async function getNextRace(now = new Date()): Promise<F1NextRace | null> {
  const meetings = await getSeason(env.season); const allSessions = await openF1<OpenF1Session[]>(`/sessions?year=${env.season}`)
  for (const meeting of meetings) {
    if (new Date(meeting.end).getTime() <= now.getTime()) continue
    const sessions = allSessions.filter((session) => session.meeting_key === meeting.meetingKey).sort(sortByStart)
    const race = sessions.find((session) => session.session_name.toLowerCase() === 'race')
    if (race && new Date(race.date_start).getTime() > now.getTime()) return { ...meeting, start: race.date_start, end: race.date_end, raceSession: normalizeSession(race), sessions: sessions.map(normalizeSession) }
  }
  return null
}
export async function getDrivers(sessionKey = 'latest') { return openF1<unknown[]>(`/drivers?session_key=${encodeURIComponent(sessionKey)}`) }
async function latestCompletedRaceSessionKey() {
  const latest = await completedRaceSessions().then((sessions) => sessions.at(-1))
  if (!latest) throw new OpenF1Error('No completed race session is available for the current season.')
  return latest.session_key
}
async function completedRaceSessions() {
  const sessions = await openF1<OpenF1Session[]>(`/sessions?year=${env.season}`)
  return sessions.filter((session) => session.session_name.toLowerCase() === 'race' && new Date(session.date_start).getTime() <= Date.now()).sort(sortByStart)
}
async function loadDriverMetadata(sessionKey: number, driverNumbers: Set<number>) {
  const races = await completedRaceSessions()
  const metadata = new Map<number, OpenF1Driver>()
  const orderedKeys = [sessionKey, ...races.slice().reverse().map((race) => race.session_key).filter((key) => key !== sessionKey)]
  for (const key of orderedKeys) {
    if (metadata.size >= driverNumbers.size) break
    try {
      const drivers = await openF1<OpenF1Driver[]>(`/drivers?session_key=${key}`)
      for (const driver of drivers) if (driverNumbers.has(driver.driver_number) && !metadata.has(driver.driver_number)) metadata.set(driver.driver_number, driver)
    } catch {
      // A missing historical metadata snapshot should not invalidate valid standings.
    }
  }
  return metadata
}
function resultTime(result: OpenF1SessionResult, winnerDuration: number | null) {
  if (result.dsq) return 'DSQ'
  if (result.dns) return 'DNS'
  if (result.dnf) return 'DNF'
  if (result.position === 1 && result.duration != null) return `${Math.floor(result.duration / 60)}:${String(Math.floor(result.duration % 60)).padStart(2, '0')}`
  if (result.gap_to_leader != null && result.gap_to_leader > 0) return `+${result.gap_to_leader.toFixed(3)}s`
  if (winnerDuration != null && result.duration != null) return `+${(result.duration - winnerDuration).toFixed(3)}s`
  return '—'
}
function normalizeRaceResult(result: OpenF1SessionResult, driver: OpenF1Driver | undefined, winnerDuration: number | null): F1LastRaceDriver {
  const imageUrl = driver?.headshot_url ?? null
  return { position: result.position, driverNumber: result.driver_number, driver: driver ? `${driver.first_name} ${driver.last_name}` : `Driver ${result.driver_number}`, team: driver?.team_name ?? 'Team unavailable', teamColor: driver?.team_colour ? `#${driver.team_colour}` : null, countryCode: driver?.country_code ?? DRIVER_COUNTRY_CODES[result.driver_number] ?? null, imageUrl, status: result.dnf || result.dns || result.dsq ? resultTime(result, winnerDuration) : 'Finished', time: resultTime(result, winnerDuration) }
}
export async function getLastRace(): Promise<F1LastRace | null> {
  const races = await completedRaceSessions()
  const raceSession = races.at(-1)
  if (!raceSession) return null
  const [meetings, results] = await Promise.all([
    getSeason(env.season),
    openF1<OpenF1SessionResult[]>(`/session_result?session_key=${raceSession.session_key}`),
  ])
  const meeting = meetings.find((item) => item.meetingKey === raceSession.meeting_key)
  if (!meeting || !results.length) return null
  const ordered = results.filter((result) => result.position > 0).sort((a, b) => a.position - b.position)
  const driverMap = await loadDriverMetadata(raceSession.session_key, new Set(ordered.map((result) => result.driver_number)))
  const winnerDuration = ordered[0]?.duration ?? null
  const normalized = ordered.slice(0, 10).map((result) => normalizeRaceResult(result, driverMap.get(result.driver_number), winnerDuration))
  return { meetingKey: meeting.meetingKey, round: meeting.round, raceName: meeting.name, officialName: meeting.officialName, country: meeting.country, location: meeting.location, circuit: meeting.circuit, circuitKey: meeting.circuitKey, raceDate: raceSession.date_start, winner: normalized[0], secondPlace: normalized[1] ?? null, thirdPlace: normalized[2] ?? null, results: normalized }
}
export async function getDriverStandings(): Promise<F1DriverStanding[]> {
  const sessionKey = await latestCompletedRaceSessionKey()
  const standings = await openF1<OpenF1DriverStanding[]>(`/championship_drivers?session_key=${sessionKey}`)
  const driverMap = await loadDriverMetadata(sessionKey, new Set(standings.map((standing) => standing.driver_number)))
  return standings.sort((a, b) => a.position_current - b.position_current).map((standing) => {
    const driver = driverMap.get(standing.driver_number)
    const imageUrl = driver?.headshot_url ?? null
    return { position: standing.position_current, driverNumber: standing.driver_number, driver: driver ? `${driver.first_name} ${driver.last_name}` : `Driver ${standing.driver_number}`, team: driver?.team_name ?? 'Team unavailable', points: standing.points_current, teamColor: driver?.team_colour ? `#${driver.team_colour}` : null, countryCode: driver?.country_code ?? DRIVER_COUNTRY_CODES[standing.driver_number] ?? null, nationality: driver?.country_name ?? null, imageUrl }
  })
}
export async function getTeamStandings(): Promise<F1TeamStanding[]> {
  const sessionKey = await latestCompletedRaceSessionKey()
  const standings = await openF1<OpenF1TeamStanding[]>(`/championship_teams?session_key=${sessionKey}`)
  let drivers: OpenF1Driver[] = []
  try { drivers = await openF1<OpenF1Driver[]>(`/drivers?session_key=${sessionKey}`) } catch { /* team standings remain valid without optional color metadata */ }
  const teamColors = new Map<string, string>()
  for (const driver of drivers) if (driver.team_colour && !teamColors.has(driver.team_name)) teamColors.set(driver.team_name, `#${driver.team_colour}`)
  return standings.sort((a, b) => a.position_current - b.position_current).map((standing) => ({ position: standing.position_current, team: standing.team_name, points: standing.points_current, teamColor: teamColors.get(standing.team_name) ?? null }))
}
