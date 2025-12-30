import React, { useEffect, useRef } from 'react';
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import VibeCodeSection from "../components/VibeCodeSection";

const ProjectPage = () => {
  const scrollContainerRef = useRef(null);

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