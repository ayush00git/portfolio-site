import HeroSection from '../components/HeroSection';

export default function HomePage() {
    return (
        <div className="bg-[#0D1117]">
            <HeroSection />

            <section className="px-8 md:px-16 py-[16vh]">
                <span className="font-jb text-[10px] tracking-[0.35em] uppercase text-white/40">
                    about
                </span>
                <p className="mt-8 max-w-3xl font-display text-white text-3xl md:text-5xl leading-[1.3] lowercase tracking-tight">
                    i'm ayush. i'm from himachal and i study cs at nit hamirpur.
                    i write backend code, mostly go, and i spend more time on
                    open source than on coursework.
                </p>
            </section>
        </div>
    );
}
