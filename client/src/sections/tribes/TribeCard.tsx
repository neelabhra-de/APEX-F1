import type { CSSProperties } from 'react'
import type { Tribe } from './tribeData'

type TribeCardProps = { tribe: Tribe }

function TribeCard({ tribe }: TribeCardProps) {
  const style = { '--tribe': tribe.color, '--tribe-soft': tribe.colorSoft } as CSSProperties

  return (
    <article className={`tribe-card tribe-card--${tribe.className}`} style={style}>
      <div className="tribe-card__texture" aria-hidden="true">
        <img
          className="tribe-card__image"
          src={tribe.image}
          alt=""
          // The cards live in a pinned transformed track; eager loading avoids a blank
          // frame when a later image crosses into the viewport during a fast scroll.
          loading="eager"
          decoding="async"
          style={{ objectPosition: tribe.imagePosition }}
        />
        <span className="tribe-card__image-treatment" />
        <span className="tribe-card__halo" />
        <span className="tribe-card__beam tribe-card__beam--one" />
        <span className="tribe-card__beam tribe-card__beam--two" />
      </div>
      <p className="tribe-card__number" aria-hidden="true">{tribe.number}</p>
      <div className="tribe-card__meta">
        <span>APEX / THE TRIBES</span>
        <span>{tribe.location}</span>
      </div>
      <div className="tribe-card__copy">
        <p className="tribe-card__eyebrow">{tribe.atmosphere}</p>
        <h2>{tribe.title}</h2>
        <p className="tribe-card__description">{tribe.copy}</p>
        <span className="tribe-card__explore">Explore <i>→</i></span>
      </div>
      <p className="tribe-card__index">{tribe.number} / 04</p>
      <span className="tribe-card__line" aria-hidden="true" />
    </article>
  )
}

export default TribeCard
