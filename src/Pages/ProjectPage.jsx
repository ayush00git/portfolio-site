import React, { useEffect, useRef, useState } from 'react';
import { Target, Github, ExternalLink, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TargetCursor from '../components/TargetCursor';

gsap.registerPlugin(ScrollTrigger);

import { projects, vibeProjects, skillGroups } from '../data/projects';

const HoverTitle = ({ text, className }) => (
  <h2 className={className}>
    {text.split('').map((char, i) => (
      <span key={i} className="hover:text-[#0d1117] inline-block" style={{ transition: 'none' }}>
        {char === ' ' ? ' ' : char}
      </span>
    ))}
  </h2>
);

const SkillPanel = ({ group }) => (
  <section className="shrink-0 w-screen md:w-[36vw] h-full border-l border-[#30363d] relative flex flex-col justify-center px-8 md:px-12 overflow-hidden">
    {/* Ghost group number, bled off the top-right */}
    <span className="absolute -top-8 md:-top-12 right-2 text-[28vw] md:text-[14vw] leading-none font-black text-[#141a22] select-none pointer-events-none">
      {group.id}
    </span>

    <span className="relative font-mono text-xs text-[#8b949e] uppercase tracking-widest mb-8">
      {group.label}
    </span>

    <ul className="relative flex flex-col gap-1 md:gap-2">
      {group.items.map((item, i) => (
        <li
          key={item}
          data-drift={(i % 2 === 0 ? -1 : 1) * (0.01 + i * 0.003)}
          className="skill-word will-change-transform text-4xl md:text-[2.9vw] font-black uppercase tracking-tighter leading-[1.05] w-fit cursor-target"
        >
          {item}
        </li>
      ))}
    </ul>
  </section>
);

const PanelCard = ({ project, index }) => (
  <article className="group relative shrink-0 w-screen md:w-[46vw] h-full border-l border-[#30363d] flex flex-col justify-between p-8 md:p-14 overflow-hidden hover:bg-[#0f151d] transition-colors duration-500">
    {/* Oversized index, bled off the bottom-right corner */}
    <span className="absolute -bottom-14 -right-4 text-[22vw] md:text-[16vw] leading-none font-black text-[#161b22] select-none pointer-events-none group-hover:text-[#1b222c] transition-colors duration-500">
      {String(index + 1).padStart(2, '0')}
    </span>

    {/* Top: category */}
    <div className="relative">
      <span className="font-mono text-xs text-[#8b949e] uppercase tracking-widest">
        {project.category}
      </span>
    </div>

    {/* Middle: title + description */}
    <div className="relative">
      <h3 className="text-5xl md:text-[4.5vw] font-black text-white leading-[0.9] uppercase tracking-tighter mb-6">
        {project.title}
      </h3>
      <div className="w-16 h-1 bg-[#30363d] mb-6 group-hover:w-32 group-hover:bg-white transition-all duration-500"></div>
      <p className="text-[#8b949e] text-base md:text-lg leading-relaxed font-light max-w-md">
        {project.description}
      </p>
    </div>

    {/* Bottom: links */}
    <div className="relative">
      <div className="flex items-center gap-8">
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-target flex items-center gap-2 text-white font-semibold hover:text-[#8b949e] transition-colors uppercase tracking-wider text-sm"
        >
          <Github size={18} />
          <span>Code</span>
        </a>
        {project.liveLink !== '#' && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target group/link flex items-center gap-2 text-white font-semibold hover:text-[#8b949e] transition-colors uppercase tracking-wider text-sm"
          >
            <ExternalLink size={18} />
            <span>Live</span>
            <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </div>
  </article>
);

const ProjectPage = () => {
  const [showCursor, setShowCursor] = useState(true);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScroll = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Skill rows move relative to the horizontal scroll, each at its own speed
      track.querySelectorAll('[data-drift]').forEach((el) => {
        const d = parseFloat(el.dataset.drift);
        gsap.fromTo(
          el,
          { x: () => -0.5 * d * window.innerWidth },
          {
            x: () => 0.5 * d * window.innerWidth,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black">
      {/* Cursor Toggle */}
      <button
        onClick={() => setShowCursor(!showCursor)}
        className={`cursor-target fixed top-6 right-6 z-100 cursor-pointer p-3 rounded-full border transition-all duration-300 ${
          showCursor
            ? 'bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]'
            : 'bg-black/50 text-white/50 border-white/20 hover:text-white hover:border-white'
        }`}
        title="Toggle Cursor"
      >
        <Target size={20} />
      </button>

      {showCursor && (
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          targetSelector=".cursor-target, a, button, [role='button']"
        />
      )}

      {/* Pinned horizontal section */}
      <section ref={sectionRef} className="h-screen overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max will-change-transform">
          {/* ── Panel: Title ── */}
          <div className="shrink-0 w-screen h-full relative flex flex-col justify-center px-8 md:px-16">
            <div className="absolute top-10 left-8 md:left-16 flex items-center gap-4">
              <div className="w-3 h-3 bg-white"></div>
              <span className="font-mono text-sm tracking-widest uppercase text-[#8b949e]">
                {projects.length + vibeProjects.length} projects
              </span>
            </div>

            <HoverTitle
              text="SELECTED"
              className="cursor-cell text-[16vw] md:text-[13vw] font-black text-white tracking-tighter uppercase leading-[0.9]"
            />
            <h2
              className="text-[16vw] md:text-[13vw] font-black tracking-tighter uppercase leading-[0.9]"
              style={{ WebkitTextStroke: '2px #30363d', color: 'transparent' }}
            >
              WORKS
            </h2>

            <div className="absolute bottom-10 right-8 md:right-16 font-mono text-xs text-[#8b949e] tracking-widest uppercase">
              Scroll →
            </div>
          </div>

          {/* ── Panels: Projects ── */}
          {projects.map((project, index) => (
            <PanelCard key={project.title} project={project} index={index} />
          ))}

          {/* ── Panel: Vibe divider ── */}
          <div className="shrink-0 w-screen md:w-[55vw] h-full border-l border-[#30363d] relative flex flex-col justify-center px-8 md:px-16">
            <span className="font-bad-script text-white text-6xl md:text-8xl mb-4">vibe coded</span>
            <HoverTitle
              text="WORK"
              className="cursor-cell text-[14vw] md:text-[9vw] font-black text-white tracking-tighter uppercase leading-[0.9]"
            />
            <span className="font-mono text-xs text-[#8b949e] tracking-widest uppercase mt-8">
              Shipped fast, with AI in the loop
            </span>
          </div>

          {/* ── Panels: Vibe projects ── */}
          {vibeProjects.map((project, index) => (
            <PanelCard key={project.title} project={project} index={index + projects.length} />
          ))}

          {/* ── Panel: Skills intro ── */}
          <div className="shrink-0 w-screen md:w-[42vw] h-full border-l border-[#30363d] relative flex flex-col justify-center px-8 md:px-14">
            <div className="absolute top-10 left-8 md:left-14 flex items-center gap-4">
              <div className="w-3 h-3 bg-white"></div>
              <span className="font-mono text-sm tracking-widest uppercase text-[#8b949e]">
                Stack
              </span>
            </div>

            <HoverTitle
              text="WHAT I"
              className="cursor-cell text-[14vw] md:text-[8vw] font-black text-white tracking-tighter uppercase leading-[0.85]"
            />
            <h2
              className="text-[14vw] md:text-[8vw] font-black tracking-tighter uppercase leading-[0.85]"
              style={{ WebkitTextStroke: '2px #30363d', color: 'transparent' }}
            >
              BUILD WITH
            </h2>
          </div>

          {/* ── Panels: Skills, one per group ── */}
          {skillGroups.map((group) => (
            <SkillPanel key={group.id} group={group} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
