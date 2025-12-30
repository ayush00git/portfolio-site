import React, { useEffect, useRef, useState } from 'react';
import { Target } from 'lucide-react';
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import VibeCodeSection from "../components/VibeCodeSection";
import TargetCursor from "../components/TargetCursor";

const ProjectPage = () => {
  const scrollContainerRef = useRef(null);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollHeight = container.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      // Calculate the height of one complete cycle (all 3 sections)
      const sectionHeight = scrollHeight / 2; // Since we have 2 sets of sections

      // If we've scrolled past the first set, reset to the beginning
      if (scrollTop + clientHeight >= sectionHeight + clientHeight) {
        window.scrollTo({
          top: scrollTop - sectionHeight,
          behavior: 'instant'
        });
      }
      // If we scroll up past the beginning, jump to the second set
      else if (scrollTop < 100) {
        window.scrollTo({
          top: scrollTop + sectionHeight,
          behavior: 'instant'
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollContainerRef}>

      {/* Cursor Toggle */}
      <button
        onClick={() => setShowCursor(!showCursor)}
        className={`cursor-target fixed top-6 right-6 z-100 cursor-pointer p-3 rounded-full border transition-all duration-300 ${showCursor
          ? "bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          : "bg-black/50 text-white/50 border-white/20 hover:text-white hover:border-white"
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
      {/* First set of sections */}
      <SkillsSection />
      <ProjectsSection />
      <VibeCodeSection />

      {/* Duplicate set for infinite scroll */}
      <SkillsSection />
      <ProjectsSection />
      <VibeCodeSection />
    </div>
  );
};


export default ProjectPage;