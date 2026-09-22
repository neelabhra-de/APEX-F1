import type { ApexConstructorStanding, ApexDriverStanding, ApexRace, F1Meeting, WeekendSession } from './f1Types'

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`F1 data request failed (${response.status})`)
  return response.json() as Promise<T>
}

function sessionLabel(name: string) {
  const normalized = name.trim().replace(/\s+/g, ' ')
  if (/^practice$/i.test(normalized)) return 'Practice'
  if (/^practice\s+\d+$/i.test(normalized)) return normalized
  if (/sprint qualifying/i.test(normalized)) return 'Sprint Qualifying'
  return normalized
}

function timeLabel(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(iso))
}

function timeRange(start: string, end: string) {
  return `${timeLabel(start)} — ${timeLabel(end)}`
}

function dayLabel(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(iso))
}

function toWeekend(sessions: F1Meeting['sessions']): WeekendSession[] {
  const relevant = sessions.filter((session) => /practice|sprint|qualifying|race/i.test(session.name))
  return relevant.map((session) => ({ sessionKey: session.sessionKey, day: dayLabel(session.start), session: sessionLabel(session.name), detail: timeRange(session.start, session.end) }))
}

export async function fetchNextRace(): Promise<ApexRace> {
  const meeting = await getJson<F1Meeting>('/api/f1/next-race')
  return {
    season: `Formula 1 / ${meeting.year}`,
    round: meeting.round ? `Round ${String(meeting.round).padStart(2, '0')}` : 'Round —',
    name: meeting.name,
    city: meeting.location,
    circuit: meeting.circuit,
    circuitKey: meeting.circuitKey,
    raceStart: meeting.raceSession.start,
    weekend: toWeekend(meeting.sessions),
  }
}

export async function fetchDriverStandings(): Promise<ApexDriverStanding[]> {
  return getJson<ApexDriverStanding[]>('/api/f1/standings/drivers')
}

export async function fetchConstructorStandings(): Promise<ApexConstructorStanding[]> {
  return getJson<ApexConstructorStanding[]>('/api/f1/standings/teams')
}
