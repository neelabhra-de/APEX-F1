import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TribeTrack from './TribeTrack'

gsap.registerPlugin(ScrollTrigger)

function TribesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined

    const context = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const horizontalTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 4, distance() * 1.08)}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.tribe-card__texture', {
        xPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${Math.max(window.innerHeight * 4, distance() * 1.08)}`, scrub: 0.85 },
      })
      gsap.utils.toArray<HTMLElement>('.tribe-card').forEach((card) => {
        const image = card.querySelector<HTMLElement>('.tribe-card__image')
        if (!image) return

        gsap.fromTo(image, { scale: 1.045, xPercent: 1.5 }, {
          scale: 1,
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left right',
            end: 'center center',
            scrub: 0.85,
          },
        })
        gsap.to(image, {
          scale: 1.055,
          xPercent: -2,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'center center',
            end: 'right left',
            scrub: 0.85,
          },
        })
      })
      gsap.to('.tribe-card__number', {
        xPercent: 17,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${Math.max(window.innerHeight * 4, distance() * 1.08)}`, scrub: 0.85 },
      })
      gsap.to('.tribe-card__meta, .tribe-card__index', {
        xPercent: -5,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${Math.max(window.innerHeight * 4, distance() * 1.08)}`, scrub: 0.85 },
      })

      return horizontalTween
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section id="tribes" ref={sectionRef} className="tribes-section">
      <div className="tribes-viewport">
        <div ref={trackRef} className="tribes-track-wrap"><TribeTrack /></div>
        <div className="tribes-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}

export default TribesSection
