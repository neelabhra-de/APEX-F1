export type F1Session = {
  sessionKey: number
  meetingKey: number
  name: string
  type: string
  start: string
  end: string
}

export type F1Meeting = {
  meetingKey: number
  round: number | null
  name: string
  officialName: string
  country: string
  location: string
  circuit: string
  circuitKey: number
  start: string
  end: string
  timezoneOffset: string | null
  year: number
  raceSession: F1Session
  sessions: F1Session[]
}

export type WeekendSession = { sessionKey: number; day: string; session: string; detail: string }

export type ApexRace = {
  season: string
  round: string
  name: string
  city: string
  circuit: string
  circuitKey: number
  raceStart: string
  weekend: WeekendSession[]
}
