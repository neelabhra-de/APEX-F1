import { useEffect, useRef, useState } from 'react'

const links = [
  { id: 'machines', number: '01', label: 'The Machines' },
  { id: 'tribes', number: '02', label: 'The Tribes' },
  { id: 'grid', number: '03', label: 'The Grid' },
]

export default function GlobalMenu() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  const navigate = (id: string) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    setOpen(false)
  }

  return <>
    <button ref={triggerRef} className={`global-menu-trigger${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls="apex-global-menu" onClick={() => setOpen((value) => !value)}>Menu</button>
    {open && <div id="apex-global-menu" className="global-menu" role="dialog" aria-modal="true" aria-label="APEX navigation" onMouseDown={() => setOpen(false)}>
      <div ref={panelRef} className="global-menu__panel" tabIndex={-1} onMouseDown={(event) => event.stopPropagation()}>
        <div className="global-menu__head"><span>APEX</span><button ref={closeRef} type="button" onClick={() => setOpen(false)}>Close</button></div>
        <nav className="global-menu__links">{links.map((link) => <button key={link.id} type="button" onClick={() => navigate(link.id)}><span>{link.number}</span><strong>{link.label}</strong><i>↗</i></button>)}</nav>
        <p className="global-menu__foot">Formula 1 / 2026</p>
      </div>
    </div>}
  </>
}
