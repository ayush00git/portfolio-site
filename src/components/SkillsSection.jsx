import React, { useRef, useEffect, useState } from 'react';
import { Database, Terminal, Layout, Sparkles, ArrowUpRight, Square, Command } from 'lucide-react';

const SkillsSection = () => {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Data
    const levels = [
        {
            id: '01',
            title: "BACKEND",
            subtitle: "Backend Core",
            description: "I love building backend services, APIs and event driven architectures.",
            color: "#ff0080", // Pink
            icon: <Database size={48} />,
            stack: [
                { name: "Node.js", type: "Runtime" },
                { name: "Express.js", type: "Framework" },
                { name: "MongoDB", type: "Database" },
                { name: "REST API", type: "Arch" },
                { name: "WebSockets", type: "Realtime" },
                { name: "Microservices", type: "Arch" },
                { name: "EJS (SSR)", type: "Template" },
                { name: "Gin", type: "Framework" }
            ]
        },
        {
            id: '02',
            title: "CLOUD & TOOLS",
            subtitle: "Cloud and Tools",
            description: "I find this domain the most interesting along with the backend. Want to explore more of AWS and DevOps",
            color: "#7928ca", // Purple
            icon: <Terminal size={48} />,
            stack: [
                { name: "AWS", type: "Cloud" },
                { name: "Docker", type: "Container" },
                { name: "Linux", type: "OS" },
                { name: "Nginx", type: "Server" },
                { name: "GitHub CI/CD", type: "DevOps" },
                { name: "Postman", type: "Testing" },
            ]
        },
        {
            id: '03',
            title: "CLI DEVELOPMENT",
            subtitle: "CLI & Go Tools",
            description: "Building powerful CLI applications and tools using Go's ecosystem.",
            color: "#00ADD8", // Cyan/Blue
            icon: <Command size={48} />,
            stack: [
                { name: "Cobra", type: "Library" },
                { name: "Viper", type: "Config" }
            ]
        },
        {
            id: '04',
            title: "INTERFACE",
            subtitle: "Frontend and UI/UX",
            description: "I barely code frontend, learned these when I used to convert my figma designs to code .",
            color: "#0070f3", // Blue
            icon: <Layout size={48} />,
            stack: [
                { name: "HTML", type: "Markup" },
                { name: "CSS", type: "Style" },
                { name: "Tailwind", type: "Framework" },
                { name: "Figma", type: "Design" }
            ]
        },
        {
            id: '05',
            title: "VIBE CODING",
            subtitle: "Vibe Coding",
            description: "Literally build anything you want, just need to have a knowledge of the folder structure.",
            color: "#f5a623", // Orange
            icon: <Sparkles size={48} />,
            stack: [
                { name: "Next.js", type: "Web" },
                { name: "React Native", type: "Mobile" },
                { name: "React", type: "Lib" }
            ]
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            // Manual scroll spy logic
            if (!sectionRef.current) return;
            const sections = sectionRef.current.querySelectorAll('.skill-block');
            const triggerPoint = window.innerHeight * 0.4; // 40% down the screen

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top < triggerPoint && rect.bottom > triggerPoint) {
                    setActiveIndex(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={sectionRef} className="bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black relative">

            {/* Container */}
            <div className="flex flex-col lg:flex-row">

                {/* --- LEFT COLUMN (STICKY) --- */}
                <div className="w-full lg:w-5/12 h-[50vh] lg:h-screen sticky top-0 flex flex-col justify-between p-6 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#30363d] bg-[#0d1117] z-20">

                    {/* Top Marker */}
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-white"></div>
                        <span className="font-mono text-sm tracking-widest uppercase text-[#8b949e]">Capabilities Index</span>
                    </div>

                    {/* Dynamic Content */}
                    <div className="relative h-64 lg:h-auto flex flex-col justify-center">
                        {levels.map((level, index) => (
                            <div
                                key={level.id}
                                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${index === activeIndex
                                    ? 'opacity-100 translate-y-0 delay-150'
                                    : index < activeIndex
                                        ? 'opacity-0 -translate-y-12'
                                        : 'opacity-0 translate-y-12'
                                    } ${index !== activeIndex ? 'pointer-events-none' : ''}`}
                            >
                                <div className="text-6xl lg:text-[10rem] font-black text-[#30363d] leading-none mb-2 lg:mb-4 select-none">
                                    {level.id}
                                </div>
                                <h2 className="text-4xl lg:text-7xl font-bold text-white mb-4 lg:mb-6 uppercase tracking-tight">
                                    {level.title}
                                </h2>
                                <div className="w-16 lg:w-24 h-2 mb-4 lg:mb-8" style={{ backgroundColor: level.color }}></div>
                                <p className="text-base lg:text-xl text-[#8b949e] max-w-md leading-relaxed">
                                    {level.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Marker */}
                    <div className="hidden lg:block mt-16">
                        <span className="font-mono text-xs text-[#30363d]">SCROLL TO NAVIGATE</span>
                    </div>
                </div>


                {/* --- RIGHT COLUMN (SCROLLABLE) --- */}
                <div className="w-full lg:w-7/12 bg-[#0d1117]">
                    {levels.map((level, index) => (
                        <div
                            key={level.id}
                            className="skill-block min-h-[80vh] lg:min-h-screen flex items-center p-6 lg:p-24 border-b border-[#30363d] last:border-b-0"
                        >
                            <div className="w-full">
                                {/* Mobile Title (Only visible on small screens since sticky header might be small) */}
                                <div className="lg:hidden mb-12">
                                    <h3 className="text-3xl font-bold text-white mb-2">{level.subtitle}</h3>
                                </div>

                                {/* Grid of Blocks */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {level.stack.map((item, i) => (
                                        <div
                                            key={i}
                                            className="cursor-target group relative bg-[#161b22] border border-[#30363d] p-6 hover:bg-white transition-colors duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <Square size={12} className="text-[#30363d] group-hover:text-black fill-current" />
                                                <ArrowUpRight size={20} className="text-[#30363d] group-hover:text-black" />
                                            </div>

                                            <div>
                                                <span className="block font-mono text-xs text-[#8b949e] group-hover:text-black/60 mb-1 uppercase">
                                                    {item.type}
                                                </span>
                                                <span className="block text-2xl font-bold text-white group-hover:text-black">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SkillsSection;