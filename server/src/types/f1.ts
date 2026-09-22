export type OpenF1Meeting = { meeting_key: number; meeting_name: string; meeting_official_name: string; country_name: string; location: string; circuit_short_name: string; circuit_key: number; date_start: string; date_end: string; gmt_offset?: string; year: number }
export type OpenF1Session = { session_key: number; meeting_key: number; session_name: string; session_type: string; date_start: string; date_end: string }
export type F1Session = { sessionKey: number; meetingKey: number; name: string; type: string; start: string; end: string }
export type F1Meeting = { meetingKey: number; round: number | null; name: string; officialName: string; country: string; location: string; circuit: string; circuitKey: number; start: string; end: string; timezoneOffset: string | null; year: number }
export type F1NextRace = F1Meeting & { raceSession: F1Session; sessions: F1Session[] }
