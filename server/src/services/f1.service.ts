import { env } from '../config/env.js'
import type { F1Meeting, F1NextRace, F1Session, OpenF1Meeting, OpenF1Session } from '../types/f1.js'

const OPENF1_BASE = 'https://api.openf1.org/v1'
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { value: unknown; expiresAt: number }>()

export class OpenF1Error extends Error { statusCode = 502; constructor(message: string) { super(message); this.name = 'OpenF1Error' } }

async function openF1<T>(path: string): Promise<T> {
  const now = Date.now(); const hit = cache.get(path)
  if (hit && hit.expiresAt > now) return hit.value as T
  let response: Response
  try { response = await fetch(`${OPENF1_BASE}${path}`, { headers: { accept: 'application/json' } }) } catch (error) { throw new OpenF1Error(`OpenF1 request failed: ${error instanceof Error ? error.message : 'network error'}`) }
  if (!response.ok) throw new OpenF1Error(`OpenF1 returned ${response.status} for ${path}`)
  const value = await response.json() as T; cache.set(path, { value, expiresAt: now + CACHE_TTL_MS }); return value
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
export async function getDriverStandings() { return openF1<unknown[]>(`/championship_drivers?year=${env.season}`) }
export async function getTeamStandings() { return openF1<unknown[]>(`/championship_teams?year=${env.season}`) }
