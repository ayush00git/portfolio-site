import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/HeroSection';
import VoiceIntro, { LINE_COUNT } from '../components/VoiceIntro';

gsap.registerPlugin(ScrollTrigger);

// Scroll distance spent on each caption once the voice panel is in place.
// ~0.85 of a viewport per line (≈9 wheel notches) — the longest line runs 20
// words, which needs a few seconds to read, and its reveal alone takes ~1.5s.
const perLine = () => Math.max(640, window.innerHeight * 0.85);

// Scroll spent opening the frame, once the hero has gone fully black
const openDistance = () => Math.max(520, window.innerHeight * 0.7);

const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

export default function HomePage() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const heroRef = useRef(null);
    const veilRef = useRef(null);
    const progressRef = useRef({ progress: 0, slide: 0, open: 0 });

    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const ctx = gsap.context(() => {
            const slideDistance = () => track.scrollWidth - window.innerWidth;
            const captionDistance = () => LINE_COUNT * perLine();

            // Phase 1 slides the track across; phase 2 holds it and plays the captions
            const proxy = { p: 0 };
            gsap.to(proxy, {
                p: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${slideDistance() + openDistance() + captionDistance()}`,
                    scrub: 1,
                    pin: true,
                    invalidateOnRefresh: true,
                },
                onUpdate: () => {
                    const slide = slideDistance();
                    const open = openDistance();
                    const caption = captionDistance();
                    const total = slide + open + caption;

                    // Walk the scroll in pixels through three beats: the hero
                    // slides away to black, the frame opens, then the reel plays
                    const at = proxy.p * total;
                    let slideP;
                    let openP;
                    let captionP;

                    if (at <= slide && slide > 0) {
                        slideP = at / slide;
                        openP = 0;
                        captionP = 0;
                    } else if (at <= slide + open) {
                        slideP = 1;
                        openP = (at - slide) / open;
                        captionP = 0;
                    } else {
                        slideP = 1;
                        openP = 1;
                        captionP = Math.min(1, (at - slide - open) / caption);
                    }

                    gsap.set(track, { x: -slideP * slide });
                    progressRef.current.progress = captionP;
                    progressRef.current.slide = slideP;
                    progressRef.current.open = easeInOut(openP);

                    // The hero lags behind the track and is progressively covered
                    // and dimmed by the incoming reel, so the two dissolve
                    if (heroRef.current) {
                        gsap.set(heroRef.current, {
                            x: slideP * slide * 0.35,
                            scale: 1 - slideP * 0.06,
                        });
                    }
                    // Hero is fully black by the time the slide ends
                    if (veilRef.current) {
                        veilRef.current.style.opacity = String(Math.min(1, slideP * 1.25));
                    }
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="h-screen overflow-hidden bg-black">
            <div ref={trackRef} className="flex h-full w-max will-change-transform">
                {/* Panel: Hero */}
                <div ref={heroRef} className="relative z-0 shrink-0 w-screen h-full will-change-transform">
                    <HeroSection />
                    <div className="absolute bottom-10 right-10 font-mono text-xs text-white/50 tracking-widest uppercase z-10 pointer-events-none">
                        scroll →
                    </div>
                    {/* Dims the hero into the dark as the reel opens over it */}
                    <div
                        ref={veilRef}
                        className="absolute inset-0 bg-black opacity-0 pointer-events-none z-20"
                    />
                </div>

                {/* Panel: Voice intro */}
                <div className="relative z-10 shrink-0 w-screen h-full">
                    <VoiceIntro progressRef={progressRef} />
                </div>
            </div>
        </section>
    );
}
