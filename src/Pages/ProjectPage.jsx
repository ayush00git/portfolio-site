import React, { useEffect, useRef, useState } from 'react';
import { Github, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { projects, vibeProjects, skillGroups } from '../data/projects';

/* ── EXPERIMENT: "INDEX" ───────────────────────────────────────────────────
   Editorial, paper-first. The work as a printed index: numbered rows of very
   large type, a sticky reading column, technical coordinate marks. Scroll
   velocity shears the rows and drives the skill marquees, which reverse with
   the scroll direction. Inverts to ink for the b-roll, cutting like film.
   ──────────────────────────────────────────────────────────────────────── */

const ACCENT = '#FF3D00';

// Normalised scroll velocity (-1..1), read straight off the smoothed position
const useScrollVelocity = () => {
  const vel = useRef(0);
  useEffect(() => {
    let last = window.scrollY;
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const y = window.scrollY;
      const v = gsap.utils.clamp(-1, 1, (y - last) / 34);
      last = y;
      vel.current += (v - vel.current) * 0.16;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return vel;
};

const Row = ({ project, n, onEnter, dark }) => (
  <a
    href={project.githubLink}
    target="_blank"
    rel="noopener noreferrer"
    onMouseEnter={() => onEnter(project)}
    className="index-row group relative block border-t will-change-transform"
    style={{ borderColor: dark ? 'rgba(244,242,237,0.16)' : 'rgba(13,17,23,0.16)' }}
  >
    {/* Wipe that fills the row on hover */}
    <span
      className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,0.32,0.23,1)] group-hover:scale-y-100"
      style={{ background: dark ? '#F4F2ED' : '#0D1117' }}
    />

    <div className="relative flex items-baseline gap-[3vw] py-[1.6vh] px-[1vw]">
      <span
        className="font-jb text-[10px] tracking-[0.3em] w-12 shrink-0 transition-colors duration-500"
        style={{ color: ACCENT }}
      >
        {String(n).padStart(2, '0')}
      </span>

      <h3
        className={`font-display text-[7.4vw] md:text-[5.4vw] leading-[0.98] lowercase tracking-[-0.03em] transition-all duration-[600ms] ease-[cubic-bezier(0.23,0.32,0.23,1)] group-hover:translate-x-[1.4vw] ${
          dark
            ? 'text-[#F4F2ED] group-hover:text-[#0D1117]'
            : 'text-[#0D1117] group-hover:text-[#F4F2ED]'
        }`}
      >
        {project.title}
      </h3>

      <span
        className={`ml-auto hidden md:block font-jb text-[10px] tracking-[0.25em] uppercase whitespace-nowrap transition-colors duration-500 ${
          dark
            ? 'text-[#F4F2ED]/45 group-hover:text-[#0D1117]/60'
            : 'text-[#0D1117]/45 group-hover:text-[#F4F2ED]/60'
        }`}
      >
        {project.category}
      </span>

      <ArrowUpRight
        size={20}
        className={`shrink-0 transition-all duration-500 group-hover:rotate-45 ${
          dark
            ? 'text-[#F4F2ED]/40 group-hover:text-[#0D1117]'
            : 'text-[#0D1117]/40 group-hover:text-[#F4F2ED]'
        }`}
      />
    </div>
  </a>
);

// Skills as marquee bands that reverse with the scroll direction
const Marquee = ({ group, i, vel }) => {
  const inner = useRef(null);
  const x = useRef(0);

  useEffect(() => {
    let raf;
    const dir = i % 2 === 0 ? -1 : 1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = inner.current;
      if (!el) return;
      const half = el.scrollWidth / 2 || 1;
      // Idle drift that the scroll can overpower and flip: scrolling back up
      // drags the band the other way
      x.current += dir * (0.5 + vel.current * 14);
      if (x.current <= -half) x.current += half;
      if (x.current >= 0) x.current -= half;
      el.style.transform = `translate3d(${x.current}px,0,0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, vel]);

  const run = [...group.items, ...group.items];

  return (
    <div className="relative overflow-hidden border-t border-[#0D1117]/12 py-[0.7vh]">
      <span className="absolute left-[1vw] top-1/2 -translate-y-1/2 z-10 font-jb text-[9px] tracking-[0.3em] uppercase text-[#0D1117]/40 bg-[#F4F2ED] pr-4">
        {group.id} {group.label}
      </span>
      <div ref={inner} className="flex w-max whitespace-nowrap will-change-transform">
        {run.map((item, k) => (
          <span
            key={`${item}-${k}`}
            className="font-display text-[4.4vh] lowercase tracking-[-0.02em] text-[#0D1117]/80 px-[1.4vw]"
          >
            {item.toLowerCase()}
            <span style={{ color: ACCENT }} className="ml-[1.4vw]">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

const ProjectPage = () => {
  const vel = useScrollVelocity();
  const [active, setActive] = useState(projects[0]);

  // Shear every row with the scroll, the way a printed page drags
  useEffect(() => {
    const rows = gsap.utils.toArray('.index-row');
    const shear = gsap.quickTo(rows, 'skewY', { duration: 0.55, ease: 'power3' });
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      shear(vel.current * 1.5);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vel]);

  return (
    <div className="film-grain relative bg-[#F4F2ED] text-[#0D1117] selection:bg-[#FF3D00] selection:text-white">
      {/* ── Masthead ── */}
      <header className="relative px-[4vw] pt-[16vh] pb-[8vh]">
        <div className="flex items-start justify-between font-jb text-[10px] tracking-[0.35em] uppercase text-[#0D1117]/45">
          <span>index of work · 2024—2026</span>
          <span>[{String(projects.length + vibeProjects.length).padStart(2, '0')}].0 entries</span>
        </div>

        <h1 className="mt-[6vh] font-display text-[15vw] leading-[0.85] lowercase tracking-[-0.045em]">
          selected
          <br />
          <span className="inline-flex items-baseline gap-[2vw]">
            work
            <span style={{ color: ACCENT }} className="text-[6vw]">
              ↘
            </span>
          </span>
        </h1>

        <p className="mt-[6vh] max-w-md text-[#0D1117]/60 leading-relaxed">
          backend systems, open source and the occasional weekend build. hover an entry to read it.
        </p>
      </header>

      {/* ── Index + sticky reader ── */}
      <div className="relative px-[4vw] pb-[12vh] flex gap-[4vw]">
        <div className="flex-1 min-w-0">
          {projects.map((project, i) => (
            <Row key={project.title} project={project} n={i + 1} onEnter={setActive} />
          ))}
          <div className="border-t border-[#0D1117]/16" />
        </div>

        {/* The reading column holds whatever the cursor is on */}
        <aside className="hidden lg:block w-[24vw] shrink-0">
          <div className="sticky top-[18vh]">
            <span className="font-jb text-[9px] tracking-[0.35em] uppercase text-[#0D1117]/40">
              now reading
            </span>
            <div key={active.title} className="mt-5">
              <h4 className="font-display text-[2.6vw] leading-[1] lowercase tracking-[-0.03em]">
                {active.title}
              </h4>
              <span
                className="mt-3 block h-[2px] w-10"
                style={{ background: ACCENT }}
              />
              <p className="mt-5 text-sm leading-relaxed text-[#0D1117]/65">{active.description}</p>
              <div className="mt-6 flex items-center gap-5 font-jb text-[10px] tracking-[0.25em] uppercase">
                <a
                  href={active.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-50 transition-opacity"
                >
                  <Github size={13} /> code
                </a>
                {active.liveLink !== '#' && (
                  <a
                    href={active.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:opacity-50 transition-opacity"
                    style={{ color: ACCENT }}
                  >
                    live <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Cut to ink for the b-roll ── */}
      <section className="bg-[#0D1117] text-[#F4F2ED] px-[4vw] py-[12vh]">
        <div className="flex items-start justify-between font-jb text-[10px] tracking-[0.35em] uppercase text-[#F4F2ED]/45">
          <span>b-roll · vibe coded</span>
          <span>shipped fast, ai in the loop</span>
        </div>
        <h2 className="mt-[4vh] mb-[6vh] font-display text-[11vw] leading-[0.86] lowercase tracking-[-0.045em]">
          off the clock
        </h2>
        {vibeProjects.map((project, i) => (
          <Row key={project.title} project={project} n={projects.length + i + 1} onEnter={() => {}} dark />
        ))}
        <div className="border-t border-[#F4F2ED]/16" />
      </section>

      {/* ── Skills, as marquee bands ── */}
      <section className="py-[10vh]">
        <div className="px-[4vw] mb-[4vh] flex items-baseline justify-between font-jb text-[10px] tracking-[0.35em] uppercase text-[#0D1117]/45">
          <span>the toolkit</span>
          <span>← scroll reverses the bands →</span>
        </div>
        {skillGroups.map((group, i) => (
          <Marquee key={group.id} group={group} i={i} vel={vel} />
        ))}
        <div className="border-t border-[#0D1117]/12" />
      </section>

      {/* ── Colophon ── */}
      <footer className="px-[4vw] pb-[14vh] pt-[6vh]">
        <a
          href="https://github.com/ayush00git"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-block"
        >
          <span className="font-jb text-[10px] tracking-[0.35em] uppercase text-[#0D1117]/45">
            full archive
          </span>
          <h2 className="mt-4 font-display text-[9vw] leading-[0.9] lowercase tracking-[-0.04em] transition-colors duration-500 group-hover:text-[#FF3D00]">
            github/ayush00git ↗
          </h2>
        </a>
      </footer>
    </div>
  );
};

export default ProjectPage;
