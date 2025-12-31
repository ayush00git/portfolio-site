import React from 'react';
import { Trophy, GitPullRequest, ArrowUpRight, Crown } from 'lucide-react';

const Achievements = () => {
    const achievements = [
        {
            id: "01",
            event: "ELECTROTHON 7.0",
            role: "NATIONAL WINNER",
            title: "Best Beginner Hack",
            description: "Secured the top spot by building 'MotionEye', an accessibility tool for Alzheimer's patients.",
            date: "MARCH 2025",
            icon: <Trophy size={64} />,
            color: "#eab308", // Gold
            bgHover: "hover:bg-[#eab308]",
            textHover: "group-hover:text-black",
            borderHover: "group-hover:border-black/10",
            stats: [
                { label: "Team", value: "Lead" },
                { label: "Project", value: "MotionEye" }
            ],
            link: "https://electrothon-7.devfolio.co/projects?prizes=6f70899d038a47fa81b37f34c8ae8b65&show_winners=false"
        },
        {
            id: "02",
            event: "HACKTOBERFEST",
            role: "GLOBAL CONTRIBUTOR",
            title: "Open Source",
            description: "Completed the global challenge by merging 6+ quality PRs. Planted a tree & earned the kit.",
            date: "OCT 2025",
            icon: <GitPullRequest size={64} />,
            color: "#f97316", // Orange
            bgHover: "hover:bg-[#f97316]",
            textHover: "group-hover:text-black",
            borderHover: "group-hover:border-black/10",
            stats: [
                { label: "PRs", value: "6 Merged" },
                { label: "Reward", value: "Tree" }
            ],
            link: "https://tree-nation.com/certificate/f3f6603eab101a47"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-white selection:text-black py-24">

            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-24 border-b border-[#30363d] pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Crown size={20} className="text-white" />
                            <span className="font-mono text-sm text-white uppercase tracking-widest">Hall of Fame</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
                            Honors.
                        </h1>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <p className="text-right font-mono text-[#8b949e] text-sm uppercase tracking-widest">
                            Verified Credentials
                        </p>
                        <p className="text-right font-mono text-white text-xl">
                            2025 Collection
                        </p>
                    </div>
                </div>

                {/* Poster Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative min-h-[600px] border border-[#30363d] bg-[#161b22] p-8 md:p-12 flex flex-col justify-between transition-colors duration-500 ease-out cursor-default ${item.bgHover}`}
                        >
                            {/* Top Row: Date & ID */}
                            <div className={`flex justify-between items-start border-b border-[#30363d] pb-6 mb-8 transition-colors ${item.borderHover}`}>
                                <span className={`font-mono text-sm uppercase tracking-widest text-[#8b949e] ${item.textHover} transition-colors`}>
                                    {item.date}
                                </span>
                                <span className={`font-mono text-xl font-bold text-white ${item.textHover} transition-colors`}>
                                    /{item.id}
                                </span>
                            </div>

                            {/* Middle: Icon & Main Text */}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className={`mb-8 text-white ${item.textHover} transition-colors duration-300`}>
                                    {item.icon}
                                </div>

                                <h3 className={`font-mono text-sm font-bold uppercase tracking-widest mb-2 text-[#8b949e] ${item.textHover} transition-colors`}>
                                    {item.event}
                                </h3>
                                <h2 className={`text-5xl md:text-6xl font-black text-white uppercase leading-none mb-6 ${item.textHover} transition-colors`}>
                                    {item.title}
                                </h2>
                                <p className={`text-lg text-[#8b949e] font-light leading-relaxed max-w-sm ${item.textHover} transition-colors`}>
                                    {item.description}
                                </p>
                            </div>

                            {/* Bottom: Stats & Action */}
                            <div className={`mt-12 pt-6 border-t border-[#30363d] flex items-end justify-between transition-colors ${item.borderHover}`}>
                                <div className="flex gap-12">
                                    {item.stats.map((stat, i) => (
                                        <div key={i}>
                                            <span className={`block text-[10px] font-mono uppercase text-[#8b949e] mb-1 ${item.textHover} transition-colors`}>
                                                {stat.label}
                                            </span>
                                            <span className={`block text-xl font-bold text-white uppercase ${item.textHover} transition-colors`}>
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 border border-[#30363d] rounded-full flex items-center justify-center text-white ${item.textHover} ${item.borderHover} transition-colors hover:bg-white/10`}>
                                    <ArrowUpRight size={24} />
                                </a>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Achievements;