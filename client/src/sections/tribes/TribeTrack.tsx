import TribeCard from './TribeCard'
import { tribes } from './tribeData'

function TribeTrack() {
  return (
    <div className="tribes-track">
      <section className="tribes-intro" aria-labelledby="tribes-title">
        <p className="tribes-intro__kicker">After the machine / before the flag falls</p>
        <p className="tribes-intro__word">The tribes</p>
        <h1 id="tribes-title">Every team<br />has a tribe.</h1>
        <p className="tribes-intro__note">Four colours. Four ways of believing.</p>
        <span className="tribes-intro__mark">01—04</span>
      </section>
      {tribes.map((tribe) => <TribeCard key={tribe.number} tribe={tribe} />)}
      <section className="tribes-outro" aria-label="End of tribes sequence">
        <p>Beyond the flag</p>
        <span>APEX / 2026</span>
      </section>
    </div>
  )
}

export default TribeTrack
