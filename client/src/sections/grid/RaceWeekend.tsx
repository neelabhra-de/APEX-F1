import type { WeekendSession } from '../../data/f1/f1Types'

type RaceWeekendProps = { sessions: WeekendSession[] }

function RaceWeekend({ sessions }: RaceWeekendProps) {
  return (
    <section className="grid-weekend" aria-labelledby="weekend-title">
      <div className="grid-weekend__heading"><p id="weekend-title">Race weekend</p><span>Session times / UTC</span></div>
      <div className="grid-weekend__sessions">
        {sessions.map((session, index) => (
          <div className="grid-session" key={session.sessionKey}>
            <span className="grid-session__number">0{index + 1}</span><p className="grid-session__day">{session.day}</p>
            <p className="grid-session__name">{session.session}</p><span className="grid-session__detail">{session.detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RaceWeekend
