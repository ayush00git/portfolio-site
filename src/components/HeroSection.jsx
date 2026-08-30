const HeroSection = () => {
    return (
        <div className="relative w-screen h-screen bg-[#0D1117] overflow-hidden flex items-center justify-center select-none">
            {/* Top Left - Introduction */}
            <div className="absolute top-10 left-10 z-10 max-w-md pointer-events-none">
                <span className="font-jb text-[10px] tracking-[0.35em] uppercase text-white/40">
                    about
                </span>
                <p className="mt-4 font-display text-white text-xl md:text-2xl leading-[1.35] lowercase tracking-tight">
                    i'm ayush. i'm from himachal and i study cs at nit hamirpur.
                    i write backend code, mostly go, and i spend more time on
                    open source than on coursework.
                </p>
            </div>

            {/* Center Image */}
            <div className="relative z-5 flex items-end justify-center w-full h-full pointer-events-none">
                <img
                    src="/me.png"
                    alt="Ayush Kumar"
                    className="h-full w-auto object-cover object-top brightness-95"
                />
            </div>
        </div>
    );
};

export default HeroSection;
