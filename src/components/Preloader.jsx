import { useEffect, useRef, useState } from 'react';

const NAME = 'ayush kumar';
const COUNT_MS = 1900;

// Counts up, then lifts the curtain off the hero.
const Preloader = ({ onDone }) => {
    const [count, setCount] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const done = useRef(false);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            onDone();
            return;
        }

        let raf;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - start) / COUNT_MS);
            // Ease out, so it races ahead then settles on 100
            setCount(Math.round((1 - (1 - t) ** 3) * 100));
            if (t < 1) raf = requestAnimationFrame(tick);
            else setTimeout(() => setLeaving(true), 260);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [onDone]);

    const finish = () => {
        if (done.current) return;
        done.current = true;
        onDone();
    };

    return (
        <div
            onTransitionEnd={(e) => e.propertyName === 'transform' && finish()}
            className={`fixed inset-0 z-[200] bg-[#0D1117] flex flex-col justify-between px-8 md:px-16 py-10 transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                leaving ? '-translate-y-full' : 'translate-y-0'
            }`}
        >
            <span className="font-jb text-[10px] tracking-[0.35em] uppercase text-white/40">
                loading
            </span>

            {/* Name, revealed a letter at a time as the count climbs */}
            <h1 className="font-display text-white text-[12vw] md:text-[8vw] leading-[0.9] lowercase tracking-[-0.04em]">
                {NAME.split('').map((ch, i) => (
                    <span
                        key={i}
                        className="inline-block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                            opacity: count > ((i + 1) / NAME.length) * 88 ? 1 : 0,
                            transform:
                                count > ((i + 1) / NAME.length) * 88
                                    ? 'translateY(0)'
                                    : 'translateY(0.35em)',
                        }}
                    >
                        {ch === ' ' ? ' ' : ch}
                    </span>
                ))}
            </h1>

            <div className="flex items-end justify-between">
                <div className="relative h-px w-1/2 bg-white/15">
                    <div
                        className="absolute inset-y-0 left-0 bg-[#FF3D00]"
                        style={{ width: `${count}%` }}
                    />
                </div>
                <span className="font-jb text-white text-[14vw] md:text-[7vw] leading-none tabular-nums">
                    {String(count).padStart(3, '0')}
                </span>
            </div>
        </div>
    );
};

export default Preloader;
