import { useEffect, useState } from 'react'

const links = [
  { id: 'machines', number: '01', label: 'The Machines' },
  { id: 'tribes', number: '02', label: 'The Tribes' },
  { id: 'grid', number: '03', label: 'The Grid' },
]

export default function GlobalMenu() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])
  const navigate = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setOpen(false) }
  return <>
    <button className={`global-menu-trigger${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls="apex-global-menu" onClick={() => setOpen((value) => !value)}>Menu</button>
    {open && <div id="apex-global-menu" className="global-menu" role="dialog" aria-modal="true" aria-label="APEX navigation" onMouseDown={() => setOpen(false)}>
      <div className="global-menu__panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="global-menu__head"><span>APEX</span><button type="button" onClick={() => setOpen(false)}>Close</button></div>
        <nav className="global-menu__links">{links.map((link) => <button key={link.id} type="button" onClick={() => navigate(link.id)}><span>{link.number}</span><strong>{link.label}</strong><i>↗</i></button>)}</nav>
        <p className="global-menu__foot">Formula 1 / 2026</p>
      </div>
    </div>}
  </>
}
