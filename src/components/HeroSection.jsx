import React, { useState, useRef } from 'react';

const HeroSection = () => {
    const [linePosition, setLinePosition] = useState(340); // Initial position from bottom in pixels - between texts
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (isDragging && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const newPosition = containerRect.bottom - e.clientY;
            // Constrain the line between 20px and 90% of viewport height
            const constrainedPosition = Math.max(20, Math.min(newPosition, window.innerHeight * 0.9));
            setLinePosition(constrainedPosition);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add global mouse move and mouse up listeners when dragging
    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative w-screen h-screen bg-[#0D1117] overflow-hidden flex items-center justify-center select-none"
        >
            {/* Top Left - Name */}
            <div className="absolute top-10 left-10 text-white text-2xl font-semibold tracking-wide leading-tight z-10">
                <div>AYUSH</div>
                <div>KUMAR</div>
            </div>

            {/* Top Right - Social Links */}
            <div className="absolute top-10 right-10 flex flex-col gap-2 z-10">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xl font-medium tracking-wide transition-opacity hover:opacity-70"
                >
                    GITHUB
                </a>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xl font-medium tracking-wide transition-opacity hover:opacity-70"
                >
                    INSTAGRAM
                </a>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xl font-medium tracking-wide transition-opacity hover:opacity-70"
                >
                    LINKEDIN
                </a>
            </div>

            {/* Background Text - Bad Script Font */}
            <div
                className="absolute text-white font-bad-script top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[275px] whitespace-nowrap tracking-[0.2em] z-1 pointer-events-none select-none"
            >
                DEVELOPER
            </div>

            {/* Static Horizon Line - Behind Image */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-2" />

            {/* Horizontal Line - Visual Layer (Behind Image) */}
            <div
                className="absolute left-0 right-0 z-2 pointer-events-none"
                style={{ bottom: `${linePosition}px` }}
            >
                <div
                    className={`h-px ${isHovering || isDragging ? 'bg-white shadow-lg' : 'bg-white'
                        }`}
                />
            </div>

            {/* Center Image - Larger size, showing upper half */}
            <div className="relative z-5 flex items-end justify-center w-full h-full pointer-events-none">
                <img
                    src="/me.png"
                    alt="Ayush Kumar"
                    className="h-full w-auto object-cover object-top brightness-95"
                />
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-10 py-8 z-10 pointer-events-none">
                <div className="flex flex-col gap-1 text-white text-xl font-medium tracking-wide pointer-events-auto">
                    <span>BACKDEV</span>
                    <span>DESIGNER</span>
                </div>

                {/* <div className="text-white text-xl font-medium tracking-wide pointer-events-auto">
                    <span>TECHNERD</span>
                </div> */}
            </div>

            {/* Invisible Drag Handle Layer (On Top) */}
            <div
                className={`absolute left-0 right-0 z-20 ${isDragging ? 'cursor-move' : 'cursor-crosshair'
                    }`}
                style={{ bottom: `${linePosition}px` }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseDown={handleMouseDown}
            >
                {/* Larger hit area for easier dragging */}
                <div className="absolute left-0 right-0 -top-4 -bottom-4" />

                {/* Drag indicator arrows - show on hover */}
                {isHovering && !isDragging && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center gap-0.5 pointer-events-none">
                        <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3l-7 7h14l-7-7z" />
                        </svg>
                        <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 17l7-7H3l7 7z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroSection;
