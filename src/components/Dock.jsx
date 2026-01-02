'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
    const ref = useRef(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, val => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`relative inline-flex items-center justify-center rounded-full bg-[#060010] border-neutral-700 border-2 shadow-md ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, child => cloneElement(child, { isHovered }))}
        </motion.div>
    );
}

function DockLabel({ children, className = '', ...rest }) {
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = isHovered.on('change', latest => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${className} absolute -top-12 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060010] px-2 py-0.5 text-xs text-white z-50`}
                    role="tooltip"
                    style={{ x: '-50%' }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className = '' }) {
    return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
    items,
    className = 'cursor-pointer',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 64,
    dockHeight = 256,
    baseItemSize = 50
}) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef(null);

    // Desktop Auto-Hide Logic
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (window.innerWidth < 768) return; // Ignore on mobile

            const threshold = window.innerHeight - 150; // Active region: bottom 150px
            const isHoveringBottom = e.clientY > threshold;

            if (isHoveringBottom) {
                // Mouse entered bottom region: Show dock immediately & clear hide timer
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setIsOpen(true);
            } else {
                // Mouse left bottom region: Start 2s timer to hide
                if (isOpen && !timeoutRef.current) {
                    timeoutRef.current = setTimeout(() => {
                        setIsOpen(false);
                        timeoutRef.current = null;
                    }, 2000);
                }
            }
        };

        const handleResize = () => {
            // Reset state logic if needed
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isOpen]);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);

    return (
        <>
            {/* Mobile Toggle Button (FAB) */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 md:hidden z-[60] w-12 h-12 rounded-full bg-[#060010] border border-white/20 flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-[40px]"
                aria-label="Toggle Dock"
            >
                {isOpen ? <ChevronDown size={24} color="white" /> : <Menu size={24} color="white" />}
            </motion.button>

            {/* Dock Container */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        style={{ height, scrollbarWidth: 'none' }}
                        className="fixed bottom-0 left-0 right-0 pointer-events-none flex max-w-full items-center z-50"
                    >
                        <motion.div
                            onMouseMove={({ pageX }) => {
                                isHovered.set(1);
                                mouseX.set(pageX);
                                // Also keep open if interacting with dock directly on desktop
                                if (window.innerWidth >= 768 && timeoutRef.current) {
                                    clearTimeout(timeoutRef.current);
                                    timeoutRef.current = null;
                                }
                            }}
                            onMouseLeave={() => {
                                isHovered.set(0);
                                mouseX.set(Infinity);
                            }}
                            className={`${className} pointer-events-auto fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border border-white/20 pb-2 px-4 z-50 backdrop-blur-[40px] bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-20 before:pointer-events-none`}
                            style={{ height: panelHeight }}
                            role="toolbar"
                            aria-label="Application dock"
                        >
                            {items.map((item, index) => (
                                <DockItem
                                    key={index}
                                    onClick={item.onClick}
                                    className={item.className}
                                    mouseX={mouseX}
                                    spring={spring}
                                    distance={distance}
                                    magnification={magnification}
                                    baseItemSize={baseItemSize}
                                >
                                    <DockIcon>{item.icon}</DockIcon>
                                    <DockLabel>{item.label}</DockLabel>
                                </DockItem>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
