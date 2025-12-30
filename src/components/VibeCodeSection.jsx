import React from 'react';
import { Github, ExternalLink, ArrowRight, Play } from 'lucide-react';

const VibeCodeSection = () => {
    const projects = [
        {
            title: "TNC MOBILE",
            category: "Mobile / React Native",
            description: "The mobile companion for The Nerds Community. Real-time chat with push notifications, seamless room navigation, and native mobile experience for tech enthusiasts on the go.",
            tags: ["React Native", "Expo", "WebSockets", "Push Notifications", "AWS"],
            image: "/tnc-mobile.png",
            githubLink: "https://github.com/ayush00git/tnc",
            liveLink: "https://github.com/ayush00git/TNC/releases/tag/v1.0.0"
        },
        {
            title: "MY PORTFOLIO",
            category: "Creative / Web",
            description: "The website you're currently browsing! A modern, interactive portfolio showcasing my work with smooth animations, sticky scroll effects. Built to impress and inspire.",
            tags: ["React", "Tailwind CSS", "Framer Motion", "GSAP", "Vite"],
            image: "/portfolio.png",
            githubLink: "https://github.com/ayush00git/portfolio-site",
            liveLink: "https://www.ayushz.me"
        },
        {
            title: "PARKKARO SITE",
            category: "Landing / Web",
            description: "A sleek landing page for ParkKaro, a smart parking solution app. Clean design, responsive layout, and optimized for conversions to showcase the app's features and drive downloads.",
            tags: ["Next.js", "Tailwind CSS", "Responsive Design", "SEO"],
            image: "/parkkaro.png",
            githubLink: "https://github.com/ayush00git/parkkaro-site",
            liveLink: "https://park-karo-site.vercel.app/"
        },
        {
            title: "CLI PORTFOLIO",
            category: "Terminal / Interactive",
            description: "A terminal-style portfolio experience for the command-line enthusiasts. Navigate through my work using terminal commands, complete with ASCII art and retro aesthetics. Because why not?",
            tags: ["JavaScript", "Terminal UI", "ASCII Art", "Interactive CLI"],
            image: "/cli.png",
            githubLink: "https://github.com/ayush00git/portfolio",
            liveLink: "https://cli.ayushz.me"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black pb-32">

            <div className="w-full pt-24 pb-12">

                {/* Header - Now Sticky */}
                <div className="sticky top-0 z-0 max-w-7xl mx-auto px-6 mb-24 pt-10 pb-10 bg-[#0d1117] transition-all duration-300">
                    <h2 className="text-4xl md:text-8xl cursor-cell font-black text-white tracking-tighter mb-6 uppercase">
                        {"Vibe Coded Work".split('').map((char, index) => (
                            <span
                                key={index}
                                className="hover:text-[#0d1117] inline-block"
                                style={{ transition: 'none' }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h2>
                    <div className="w-24 h-1 bg-[#30363d]"></div>
                </div>

                {/* Stacking List - Full Width */}
                <div className="flex flex-col relative z-10">
                    {projects.map((project, index) => (
                        <Card key={index} project={project} index={index} />
                    ))}

                    {/* Final 'See All' Card */}
                    <a
                        href="https://github.com/ayush00git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sticky top-[380px] h-[400px] w-full bg-[#0d1117] border-t border-[#30363d] flex flex-col items-center justify-center text-center group z-50 cursor-pointer"
                    >
                        <div className="w-24 h-24 border border-[#30363d] flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                            <Play size={40} fill="currentColor" />
                        </div>
                        <h3 className="text-white font-bold text-4xl uppercase tracking-tighter">Archive</h3>
                        <p className="text-[#8b949e] mt-2 font-mono">github/ayush00git</p>
                    </a>
                </div>

            </div>
        </div>
    );
};

const Card = ({ project, index }) => {
    // Increased base offset from 100 to 220 so cards stick BELOW the header
    const topOffset = 220 + (index * 40);

    return (
        <div
            className="sticky top-0 w-full bg-[#0d1117] border-t border-[#30363d] overflow-hidden"
            style={{
                top: `${topOffset}px`,
                zIndex: index + 1
            }}
        >
            <div className="flex flex-col md:flex-row min-h-[500px] md:h-[650px]">

                {/* LEFT: Image Area (Full bleed) */}
                <div className="w-full md:w-1/2 relative overflow-hidden h-[300px] md:h-auto border-b md:border-b-0 md:border-r border-[#30363d]">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay for text contrast if needed */}
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* RIGHT: Content Area */}
                <div className="w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center bg-[#0d1117]">

                    <div className="max-w-xl">
                        <span className="font-mono text-xs text-[#8b949e] mb-4 block uppercase tracking-widest">
                            {project.category}
                        </span>

                        <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-none uppercase tracking-tight">
                            {project.title}
                        </h3>

                        <p className="text-[#8b949e] text-lg md:text-xl leading-relaxed mb-10 font-light">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-12">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="text-sm font-mono text-white/60 border-b border-white/20 pb-0.5">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-8">
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-semibold hover:text-[#8b949e] transition-colors group/link uppercase tracking-wider text-sm">
                                <Github size={18} />
                                <span>Code</span>
                            </a>
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-semibold hover:text-[#8b949e] transition-colors group/link uppercase tracking-wider text-sm">
                                <ExternalLink size={18} />
                                <span>Live</span>
                                <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VibeCodeSection;