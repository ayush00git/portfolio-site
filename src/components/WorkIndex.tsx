"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { projects, hobbyProjects, skillGroups, type Project } from '../data/projects'

/* ── THE WORK INDEX ────────────────────────────────────────────────────────
   Editorial, ink-first. The work as a printed index: numbered rows of very
   large type, a sticky reading column, technical coordinate marks. Scroll
   velocity shears the rows and drives the skill marquees, which reverse with
   the scroll direction.
   ──────────────────────────────────────────────────────────────────────── */

const ACCENT = '#34d399' // emerald-400

const Github = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// Normalised scroll velocity (-1..1), read straight off the smoothed position
const useScrollVelocity = () => {
  const vel = useRef(0)
  useEffect(() => {
    let last = window.scrollY
    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const y = window.scrollY
      const v = gsap.utils.clamp(-1, 1, (y - last) / 34)
      last = y
      vel.current += (v - vel.current) * 0.16
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return vel
}

const Row = ({ project, n, onEnter }: { project: Project; n: number; onEnter: (p: Project) => void }) => (
  <a
    href={project.githubLink !== '#' ? project.githubLink : project.liveLink}
    target="_blank"
    rel="noopener noreferrer"
    onMouseEnter={() => onEnter(project)}
    className="index-row group relative block border-t border-white/15 will-change-transform"
  >
    {/* Wipe that fills the row on hover */}
    <span className="absolute inset-0 origin-bottom scale-y-0 bg-emerald-400 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,0.32,0.23,1)] group-hover:scale-y-100" />

    <div className="relative flex items-baseline gap-[3vw] py-[1.6vh] px-[1vw]">
      <span className="font-sans text-[10px] tracking-[0.3em] w-12 shrink-0" style={{ color: ACCENT }}>
        {String(n).padStart(2, '0')}
      </span>

      <h3 className="font-display text-[7.4vw] md:text-[5.4vw] leading-[0.98] lowercase tracking-[-0.03em] text-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,0.32,0.23,1)] group-hover:translate-x-[1.4vw] group-hover:text-black">
        {project.title}
      </h3>

      <span className="ml-auto hidden md:block font-sans text-[10px] tracking-[0.25em] uppercase whitespace-nowrap text-white/45 transition-colors duration-500 group-hover:text-black/60">
        {project.category}
      </span>

      <ArrowUpRight size={20} className="shrink-0 text-white/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-black" />
    </div>
  </a>
)

// Skills as marquee bands that reverse with the scroll direction
const Marquee = ({ group, i, vel }: { group: (typeof skillGroups)[number]; i: number; vel: React.MutableRefObject<number> }) => {
  const inner = useRef<HTMLDivElement>(null)
  const x = useRef(0)

  useEffect(() => {
    let raf: number
    const dir = i % 2 === 0 ? -1 : 1
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const el = inner.current
      if (!el) return
      const half = el.scrollWidth / 2 || 1
      // Idle drift that the scroll can overpower and flip: scrolling back up
      // drags the band the other way
      x.current += dir * (0.5 + vel.current * 14)
      if (x.current <= -half) x.current += half
      if (x.current >= 0) x.current -= half
      el.style.transform = `translate3d(${x.current}px,0,0)`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [i, vel])

  const run = [...group.items, ...group.items]

  return (
    <div className="relative overflow-hidden border-t border-white/10 py-[0.7vh]">
      <div ref={inner} className="flex w-max whitespace-nowrap will-change-transform">
        {run.map((item, k) => (
          <span key={`${item}-${k}`} className="font-display text-[4.4vh] lowercase tracking-[-0.02em] text-white/80 px-[1.4vw]">
            {item.toLowerCase()}
            <span style={{ color: ACCENT }} className="ml-[1.4vw]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const Reader = ({ active }: { active: Project }) => (
  <aside className="hidden lg:block w-[24vw] shrink-0">
    <div className="sticky top-[18vh]">
      <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/40">now reading</span>
      <div key={active.title} className="mt-5">
        <h4 className="font-display text-[2.6vw] leading-[1] lowercase tracking-[-0.03em] text-white">{active.title}</h4>
        <span className="mt-3 block h-[2px] w-10" style={{ background: ACCENT }} />
        <p className="mt-5 text-sm leading-relaxed text-white/65 font-inter">{active.description}</p>
        <div className="mt-6 flex items-center gap-5 font-sans text-[10px] tracking-[0.25em] uppercase text-white">
          {active.githubLink !== '#' && (
            <a href={active.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
              <Github size={13} /> code
            </a>
          )}
          {active.liveLink !== '#' && (
            <a href={active.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-50 transition-opacity" style={{ color: ACCENT }}>
              live <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  </aside>
)

export const WorkIndex = () => {
  const vel = useScrollVelocity()
  const [active, setActive] = useState<Project>(projects[0])
  const [activeHobby, setActiveHobby] = useState<Project>(hobbyProjects[0])

  // Shear every row with the scroll, the way a printed page drags
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rows = gsap.utils.toArray<HTMLElement>('.index-row')
    const shear = gsap.quickTo(rows, 'skewY', { duration: 0.55, ease: 'power3' })
    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      shear(vel.current * 1.5)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [vel])

  return (
    <div className="film-grain relative bg-black text-white selection:bg-emerald-500/30">
      {/* ── Masthead ── */}
      <header className="relative px-[4vw] pt-[16vh] pb-[8vh]">
        <h1 className=" font-display text-[15vw] leading-[0.85] lowercase tracking-[-0.045em]">
          selected
          <br />
          <span className="inline-flex items-baseline gap-[2vw]">
            work
            <span style={{ color: ACCENT }} className="text-[6vw]">↘</span>
          </span>
        </h1>

        <p className="mt-[6vh] max-w-md text-white/60 leading-relaxed font-inter">
          backend systems, open source and the occasional weekend build.
        </p>
      </header>

      {/* ── Projects: index + sticky reader ── */}
      <section className="relative px-[4vw] pb-[12vh]">
        <div className="mb-[4vh] font-sans text-[10px] tracking-[0.35em] uppercase text-white/45">projects</div>
        <div className="flex gap-[4vw]">
          <div className="flex-1 min-w-0">
            {projects.map((project, i) => (
              <Row key={project.title} project={project} n={i + 1} onEnter={setActive} />
            ))}
            <div className="border-t border-white/15" />
          </div>
          <Reader active={active} />
        </div>
      </section>

      {/* ── Hobby projects ── */}
      <section className="relative px-[4vw] py-[12vh] bg-[#0a0a0c] border-y border-white/10">
        <div className="flex items-start justify-end font-sans text-[10px] tracking-[0.35em] uppercase text-white/45">
          <span>weekends, ai in the loop</span>
        </div>
        <h2 className="mt-[4vh] mb-[6vh] font-display text-[11vw] leading-[0.86] lowercase tracking-[-0.045em]">
          hobby projects
        </h2>
        <div className="flex gap-[4vw]">
          <div className="flex-1 min-w-0">
            {hobbyProjects.map((project, i) => (
              <Row key={project.title} project={project} n={projects.length + i + 1} onEnter={setActiveHobby} />
            ))}
            <div className="border-t border-white/15" />
          </div>
          <Reader active={activeHobby} />
        </div>
      </section>

      {/* ── Skills, as marquee bands ── */}
      <section className="py-[10vh]">
        <div className="px-[4vw] mb-[4vh] font-sans text-[10px] tracking-[0.35em] uppercase text-white/45">the toolkit</div>
        {skillGroups.map((group, i) => (
          <Marquee key={group.id} group={group} i={i} vel={vel} />
        ))}
        <div className="border-t border-white/10" />
      </section>

      {/* ── Colophon ── */}
      <footer className="px-[4vw] pb-[24vh] pt-[6vh]">
        <a href="https://github.com/ayush00git" target="_blank" rel="noopener noreferrer" className="group inline-block">
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/45">full archive</span>
          <h2 className="mt-4 font-display text-[9vw] leading-[0.9] lowercase tracking-[-0.04em] transition-colors duration-500 group-hover:text-emerald-400">
            github/ayush00git ↗
          </h2>
        </a>
      </footer>
    </div>
  )
}
