import ScrollReveal from './ScrollReveal';

const IntroSection = () => {
    return (
        <section className="min-h-screen bg-[#0D1117] font-bbh-bogle flex items-center justify-center px-10 py-20">
            <div className="w-full">
                <ScrollReveal
                    baseOpacity={0.2}
                    enableBlur={true}
                    baseRotation={4}
                    blurStrength={7}
                    textClassName="text-white font-medium text-center"
                    containerClassName="text-center"
                >
                    It started in 8th grade with a simple question: "How does Google do it?" The
                    realization that the entire world's complexity could be indexed and transferred in milliseconds didn't just fascinate me—it obsessed me. That specific curiosity about speed and scale is what pushed me to write my first line of code.
                </ScrollReveal>
            </div>
        </section>
    );
};

export default IntroSection;
