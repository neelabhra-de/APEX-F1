import type { ApexConstructorStanding, ApexDriverStanding, ApexLastRace, ApexRace, F1Meeting, WeekendSession } from './f1Types'

let cachedDriverStandings: ApexDriverStanding[] | null = null
let cachedConstructorStandings: ApexConstructorStanding[] | null = null

async function getJson<T>(path: string): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(path)
      if (response.ok) return response.json() as Promise<T>
      lastError = new Error(`F1 data request failed (${response.status})`)
    } catch (error) { lastError = error instanceof Error ? error : new Error('F1 data request failed') }
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 220))
  }
  throw lastError ?? new Error('F1 data request failed')
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
  try { const value = await getJson<ApexDriverStanding[]>('/api/f1/standings/drivers'); if (value.length) cachedDriverStandings = value; return value } catch (error) { if (cachedDriverStandings?.length) return cachedDriverStandings; throw error }
}

export async function fetchConstructorStandings(): Promise<ApexConstructorStanding[]> {
  try { const value = await getJson<ApexConstructorStanding[]>('/api/f1/standings/teams'); if (value.length) cachedConstructorStandings = value; return value } catch (error) { if (cachedConstructorStandings?.length) return cachedConstructorStandings; throw error }
}

export async function fetchLastRace(): Promise<ApexLastRace> {
  return getJson<ApexLastRace>('/api/f1/last-race')
}
