import React from 'react';
import { Github, ExternalLink, ArrowRight, Play } from 'lucide-react';

const ProjectsSection = () => {
    const projects = [
        {
            title: "THE NERDS COMMUNITY",
            category: "FullStack / Web",
            description: "A real-time chat application designed for tech enthusiasts to connect, discuss, and collaborate in dedicated rooms. A community that actually ships.",
            tags: ["MERN", "WebSockets", "AWS EC2 S3", "EDA"],
            image: "/tnc.png",
            githubLink: "https://github.com/ayush00git/tnc",
            liveLink: "https://tnc.ayushz.me"
        },
        {
            title: "DezNov",
            category: "Design / Web (In development)",
            description: "A platform where you can share your coding and design projects within the community, would help users to get inspos and connect within a community and a much more...",
            tags: ["MERN", "WebSockets", "REST API", "Figma"],
            image: "/deznov.png",
            githubLink: "https://github.com/ayush00git/DezNov",
            liveLink: "#"
        },
        {
            title: "LA/CA",
            category: "APIs / Web",
            description: "NITH official website for the registration of students in LA/CA courses. The website handled 70k+ requests in 2 days during the registrations.",
            tags: ["Node.js", "MongoDB", "REST API", "Polling", "EJS SSR", "Nodemailer"],
            image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop",
            githubLink: "https://github.com/ayush00git/laca-site",
            liveLink: "https://laca.nith.ac.in"
        },
        {
            title: "AppTeam site",
            category: "Creative/ Web",
            description: "The official website of AppTeam, a core club of NITH. The website showcases the team members, events and projects of the team. The website have handled over 50k+ requests during the freshmen interviews and workshops.",
            tags: ["Next.js", "MongoDB", "REST API"],
            image: "/appteam.png",
            githubLink: "https://github.com/ayush00git/AppTeam-official-website",
            liveLink: "https://appteam.nith.ac.in"
        },
        {
            title: "Motion Eye",
            category: "Hardware/ IoT",
            description: "Designed to detect falls among elderly or at-risk individuals using wearable devices. Upon detecting a fall, the system immediately sends alerts to registered caretakers via SMS. Won the Electrothon 7.0 (BEST BEGINNER TRACK)",
            tags: ["ESP8266", "MPU6050", "STREAMLIT", "MONGODB"],
            image: "/motioneye.png",
            githubLink: "https://github.com/ayush00git/fallDetection/",
            liveLink: "#"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black pb-32">

            <div className="w-full pt-24 pb-12">

                {/* Header - Now Sticky */}
                <div className="sticky top-0 z-0 max-w-7xl mx-auto px-6 mb-24 pt-10 pb-10 bg-[#0d1117] transition-all duration-300">
                    <h2 className="text-4xl md:text-8xl cursor-cell font-black text-white tracking-tighter mb-6 uppercase">
                        {"Selected Works".split('').map((char, index) => (
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

                    {/* Final 'See All' Card
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
                    </a> */}
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

export default ProjectsSection;