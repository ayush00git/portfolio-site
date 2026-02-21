import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';

const content = {
    intro: "I'm a student developer with a deep curiosity for Backend Core, Linux, System Design and Open Source. While my primary focus is on building robust systems, I love switching to \"Vibe Coding\" mode for UI/UX design as a creative break.",
    skills: [
        { label: "Languages", value: "Golang, Javascript, Typescript, Shell Script, C++, C, Python" },
        { label: "Web/API", value: "Go (net/http), Gin, gRPC, Node.js, Express.js, REST API, WebSockets, Microservices" },
        { label: "CLI Dev", value: "Cobra, Viper" },
        { label: "CS Fundamentals", value: "OOPs, Serialization, FDL (IDL), Monolith & Microservices Architecture" },
        { label: "Cloud/DevOps", value: "AWS (EC2, S3), Github, Docker, Linux, Nginx, Redis" },
        { label: "DB & Tools", value: "MongoDB, Git, Figma, Postman" },
        { label: "Frontend", value: "React, React Native, Next.js" }
    ],
    lately: [
        "Diving deeper into System Design and Linux Internals.",
        "Exploring advanced distributed systems patterns.",
        "Learn advanced Go"
    ]
};

const TextStream = ({ text, progress, range }) => {
    const displayedCount = useTransform(progress, range, [0, text.length]);
    const [count, setCount] = useState(0);

    useMotionValueEvent(displayedCount, "change", (latest) => {
        setCount(Math.floor(latest));
    });

    return (
        <span className="relative">
            {text.slice(0, count)}
            {count > 0 && count < text.length && (
                <span className="inline-block w-[0.6em] h-[1em] bg-blue-500/60 align-middle ml-0.5" />
            )}
        </span>
    );
};

const IntroSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} className="relative h-[600vh] bg-[#0D1117] font-mono text-white/80 selection:bg-blue-500/30">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-6 md:px-24 lg:px-40 overflow-hidden">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="mb-12 flex items-center gap-4"
                >
                    <div className="h-px w-8 bg-blue-500/50" />
                    <span className="text-blue-500 font-bold tracking-[0.2em] text-sm uppercase">About Me</span>
                    <div className="h-px flex-grow bg-white/5" />
                </motion.div>

                <div className="space-y-10 max-w-5xl">
                    {/* Intro Paragraph */}
                    <div className="text-xl md:text-2xl leading-relaxed font-medium text-white/90">
                        <TextStream text={content.intro} progress={smoothProgress} range={[0, 0.2]} />
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-base md:text-lg">
                        {content.skills.map((skill, i) => {
                            const start = 0.25 + (i * 0.06);
                            const end = start + 0.06;
                            return (
                                <div key={i} className="flex flex-col gap-1 border-l border-white/5 pl-4 hover:border-blue-500/30 transition-colors duration-300">
                                    <span className="text-blue-400/50 text-xs font-bold uppercase tracking-widest">{skill.label}</span>
                                    <span className="leading-snug">
                                        <TextStream text={skill.value} progress={smoothProgress} range={[start, end]} />
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recently/Lately Section */}
                    <div className="pt-8 border-t border-white/5">
                        <h4 className="text-sm font-bold text-blue-400/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                            Lately
                        </h4>
                        <div className="space-y-3 text-lg opacity-80">
                            {content.lately.map((item, i) => {
                                const start = 0.75 + (i * 0.07);
                                const end = start + 0.07;
                                return (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="text-blue-500/30 mt-1.5">➜</span>
                                        <TextStream text={item} progress={smoothProgress} range={[start, end]} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Simplified Bottom Progress Indicator */}
                <div className="absolute bottom-12 right-12 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-white/10">
                    <div className="w-24 h-px bg-white/5 relative overflow-hidden">
                        <motion.div 
                            style={{ scaleX: smoothProgress }}
                            className="absolute inset-0 bg-blue-500/30 origin-left"
                        />
                    </div>
                </div>
            </div>
            
            {/* Subtle background noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </section>
    );
};

export default IntroSection;
