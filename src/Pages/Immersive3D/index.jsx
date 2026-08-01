import React, { useEffect, useMemo, useRef, useState } from 'react';
import './immersive3d.css';

/* ============================================================
   THE PAVILION — a quiet architectural walk-through.

   The visitor dollies slowly through a concrete gallery built
   from CSS 3D planes (floor, walls, coffered ceiling). Rooms
   reveal themselves on approach. A concrete wall parts at the
   entrance; the walk ends at a drafting table under a skylight.

   Philosophy: quiet confidence. Nothing bounces. Nothing glows
   unless touched.
   ============================================================ */

const GAP = 1300; // distance between rooms, aligned with skylight rhythm

const content = {
    lately: [
        'Diving deeper into System Design and Linux Internals.',
        'Exploring advanced distributed systems patterns.',
        'Advanced Go.',
    ],
    languages: 'Golang · JavaScript · TypeScript · Shell · C++ · C · Python',
    craft: [
        {
            title: 'Backend Core',
            material: 'the main practice',
            tools: ['Gin', 'gRPC', 'Postgres', 'GORM', 'Node.js', 'Express.js', 'MongoDB', 'REST', 'WebSockets', 'Microservices', 'EJS (SSR)'],
        },
        {
            title: 'Cloud & Tools',
            material: 'the supporting structure',
            tools: ['AWS (EC2, S3)', 'Docker', 'Linux', 'Nginx', 'GitHub CI/CD', 'Redis', 'Postman', 'Cobra', 'Viper', 'Figma', 'React / Next.js'],
        },
    ],
    projects: [
        {
            title: 'The Nerds Community', medium: 'real-time community platform',
            description: 'A real-time chat application for tech enthusiasts to connect, discuss and collaborate in dedicated rooms. A community that actually ships.',
            materials: 'MERN · WebSockets · AWS EC2/S3 · Event-driven architecture',
            image: '/tnc.png', github: 'https://github.com/ayush00git/tnc', live: 'https://tnc.ayushz.me',
        },
        {
            title: 'goth', medium: 'authentication microservice',
            description: 'An auth-based microservice in Go — token issuance, validation and session handling as an independent, composable service.',
            materials: 'Go · Microservices · Auth',
            image: '/cli.png', github: 'https://github.com/ayush00git/goth',
        },
        {
            title: 'gothctl', medium: 'command-line instrument',
            description: 'A CLI tool for managing goth services — scaffold, configure and control auth microservices from the terminal.',
            materials: 'Go · Cobra · Viper',
            image: '/gothctl.png', github: 'https://github.com/ayush00git/gothctl',
        },
        {
            title: 'DezNov', medium: 'design community platform — in progress',
            description: 'A place to share coding and design work within a community — inspiration, connection, and conversation around the craft.',
            materials: 'MERN · WebSockets · REST · Figma',
            image: '/deznov.png', github: 'https://github.com/ayush00git/DezNov',
        },
        {
            title: 'LA/CA', medium: 'institutional registration system',
            description: 'NIT Hamirpur’s official portal for LA/CA course registration. Carried 70,000+ requests across two days of live registration without faltering.',
            materials: 'Node.js · MongoDB · REST · Polling · EJS SSR · Nodemailer',
            image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop',
            github: 'https://github.com/ayush00git/laca-site', live: 'https://laca.nith.ac.in',
        },
        {
            title: 'AppTeam', medium: 'official club presence',
            description: 'The official website of AppTeam, a core club of NIT Hamirpur — team, events and projects. Served 50,000+ requests through freshmen interviews and workshops.',
            materials: 'Next.js · MongoDB · REST',
            image: '/appteam.png', github: 'https://github.com/ayush00git/AppTeam-official-website', live: 'https://appteam.nith.ac.in',
        },
        {
            title: 'Motion Eye', medium: 'wearable safety system',
            description: 'Detects falls among elderly or at-risk individuals through wearables and alerts caretakers by SMS within moments. Best Beginner Track, Electrothon 7.0.',
            materials: 'ESP8266 · MPU6050 · Streamlit · MongoDB',
            image: '/motioneye.png', github: 'https://github.com/ayush00git/fallDetection/',
        },
    ],
    honors: [
        {
            event: 'Electrothon 7.0', role: 'National Winner', title: 'Best Beginner Hack',
            description: 'Top placement for MotionEye — a wearable fall-detection system for at-risk individuals.',
            date: 'March 2025',
            link: 'https://electrothon-7.devfolio.co/projects?prizes=6f70899d038a47fa81b37f34c8ae8b65&show_winners=false',
        },
        {
            event: 'Hacktoberfest', role: 'Global Contributor', title: 'Open Source',
            description: 'Completed the global challenge with six merged pull requests. A tree was planted.',
            date: 'October 2025',
            link: 'https://tree-nation.com/certificate/f3f6603eab101a47',
        },
        {
            event: 'Certification', role: 'Backend Specialist', title: 'Backend Excellence',
            description: 'Recognized for the design and implementation of scalable backend systems.',
            date: 'December 2025',
            link: 'https://drive.google.com/file/d/1BWlWbZXP5Niy5B9OvAyBWlNZnAzr2rKj/view?usp=drive_link',
        },
    ],
    socials: {
        email: 'mailto:ayush.2007.iit@gmail.com',
        github: 'https://github.com/ayush00git',
        linkedin: 'https://www.linkedin.com/in/ayush-kumar-368446246/',
        instagram: 'https://www.instagram.com/ayyush_z/',
        resume: 'https://drive.google.com/file/d/1hocYWUEIPINgFh6mUfeMImRo1ork7KJz/view?usp=sharing',
    },
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

/* ---------- dust motes — barely there ---------- */
function Dust() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let w, h, raf, t = 0;
        const motes = Array.from({ length: 60 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: 0.5 + Math.random() * 1.1,
            a: 0.03 + Math.random() * 0.07,
            vy: 0.00004 + Math.random() * 0.00008,
            ph: Math.random() * Math.PI * 2,
        }));

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const tick = () => {
            t += 0.004;
            ctx.clearRect(0, 0, w, h);
            for (const m of motes) {
                m.y -= m.vy;
                if (m.y < -0.02) m.y = 1.02;
                const x = (m.x + Math.sin(t + m.ph) * 0.006) * w;
                const y = m.y * h;
                ctx.fillStyle = `rgba(231, 226, 217, ${m.a})`;
                ctx.beginPath();
                ctx.arc(x, y, m.r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="pav-dust" />;
}

/* ---------- rooms ---------- */

const Threshold = () => (
    <div className="pav-threshold">
        <div className="est pav-reveal">NIT Hamirpur · est. 2024</div>
        <h1 className="pav-reveal d1">Ayush Kumar</h1>
        <div className="role pav-reveal d2">
            Backend <span>·</span> Linux <span>·</span> System Design <span>·</span> Open Source
        </div>
    </div>
);

const Who = () => (
    <div className="pav-who">
        <div className="pav-roomno pav-reveal"><b>I</b> — Who</div>
        <p className="lead pav-reveal d1">
            A student developer with a deep curiosity for <em>backend core</em>, <em>Linux</em> and{' '}
            <em>system design</em>. The focus is robust systems; the creative break is what he calls{' '}
            <em>vibe coding</em> — designing interfaces for the quiet joy of it.
        </p>
        <div className="pav-rule pav-reveal d2" />
        <div className="pav-reveal d2">
            <div className="studies-cap">Current studies</div>
            <ul className="studies">
                {content.lately.map((item) => <li key={item}>{item}</li>)}
            </ul>
        </div>
    </div>
);

const Craft = () => (
    <div className="pav-craft">
        <div className="pav-roomno pav-reveal"><b>II</b> — The Workbench</div>
        <div className="pav-bench pav-reveal d1">
            {content.craft.map((d) => (
                <div key={d.title} className="pav-drawer">
                    <h3>{d.title}</h3>
                    <div className="mat">{d.material}</div>
                    <div className="pav-tools">
                        {d.tools.map((t) => <span key={t}>{t}</span>)}
                    </div>
                </div>
            ))}
        </div>
        <div className="pav-langs pav-reveal d2">
            LANGUAGES — <b>{content.languages}</b>
        </div>
    </div>
);

const Gate = () => (
    <div className="pav-gate">
        <div className="pav-roomno pav-reveal" style={{ textAlign: 'center' }}><b>III</b> — The Gallery</div>
        <h2 className="pav-reveal d1">Selected Works</h2>
        <div className="sub pav-reveal d2">Seven pieces, hung in order of affection.</div>
    </div>
);

const Exhibit = ({ p, i }) => (
    <div className="pav-exhibit">
        <div className="pav-frame pav-reveal">
            <img src={p.image} alt={p.title} loading="lazy" />
        </div>
        <div className="pav-label pav-reveal d1">
            <div className="no">{String(i + 1).padStart(2, '0')}</div>
            <div>
                <h3>{p.title}</h3>
                <div className="medium">{p.medium}</div>
                <p>{p.description}</p>
                <div className="mats">{p.materials}</div>
                <div className="links">
                    <a href={p.github} target="_blank" rel="noopener noreferrer">Source</a>
                    {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Visit</a>}
                </div>
            </div>
        </div>
    </div>
);

const Honors = () => (
    <div className="pav-honors">
        <div className="pav-roomno pav-reveal"><b>IV</b> — Honors</div>
        <div className="plaques pav-reveal d1">
            {content.honors.map((h) => (
                <a
                    key={h.event}
                    className="pav-plaque"
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="date">{h.date}</div>
                    <h4>{h.title}</h4>
                    <div className="role">{h.role}</div>
                    <p>{h.description}</p>
                    <div className="ft"><span>{h.event}</span><span>View record →</span></div>
                </a>
            ))}
        </div>
    </div>
);

const Finale = () => (
    <div className="pav-finale">
        <div className="pav-reveal">
            <div className="pav-table" />
            <div className="pav-blueprint" />
        </div>
        <blockquote className="pav-reveal d1">
            &ldquo;The best systems are the ones that quietly endure.&rdquo;
        </blockquote>
        <div className="console pav-reveal d2">
            <a href={content.socials.email}>Write</a>
            <a href={content.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={content.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={content.socials.resume} target="_blank" rel="noopener noreferrer">Résumé</a>
        </div>
        <div className="colophon pav-reveal d3">Ayush Kumar · {new Date().getFullYear()}</div>
    </div>
);

/* ---------- the pavilion ---------- */

export default function Immersive3D() {
    const worldRef = useRef(null);
    const stationRefs = useRef([]);
    const doorLRef = useRef(null);
    const doorRRef = useRef(null);
    const doorsRef = useRef(null);
    const epigraphRef = useRef(null);
    const progressRef = useRef(null);
    const [room, setRoom] = useState(0);
    const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

    useEffect(() => {
        const onResize = () => setVw(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isNarrow = vw < 880;

    // the walk: each station is a room along the corridor
    const stations = useMemo(() => {
        const drift = isNarrow ? 0 : 230;
        const list = [
            { key: 'threshold', node: <Threshold />, x: 0, ry: 0, numeral: '', room: 'Threshold' },
            { key: 'who', node: <Who />, x: 0, ry: 0, numeral: 'I', room: 'Who' },
            { key: 'craft', node: <Craft />, x: 0, ry: 0, numeral: 'II', room: 'The Workbench' },
            { key: 'gate', node: <Gate />, x: 0, ry: 0, numeral: 'III', room: 'The Gallery' },
            ...content.projects.map((p, i) => ({
                key: `ex${i}`,
                node: <Exhibit p={p} i={i} />,
                x: (i % 2 === 0 ? -1 : 1) * drift,
                ry: isNarrow ? 0 : (i % 2 === 0 ? 9 : -9),
                numeral: 'III',
                room: `The Gallery · ${String(i + 1).padStart(2, '0')} / ${String(content.projects.length).padStart(2, '0')}`,
            })),
            { key: 'honors', node: <Honors />, x: 0, ry: 0, numeral: 'IV', room: 'Honors' },
            { key: 'finale', node: <Finale />, x: 0, ry: 0, numeral: 'V', room: 'The Last Room' },
        ];
        return list.map((s, i) => ({ ...s, z: i * GAP }));
    }, [isNarrow]);

    const totalZ = (stations.length - 1) * GAP;

    const index = useMemo(() => ([
        { numeral: 'I', name: 'Who', station: 1 },
        { numeral: 'II', name: 'Craft', station: 2 },
        { numeral: 'III', name: 'Gallery', station: 3 },
        { numeral: 'IV', name: 'Honors', station: stations.length - 2 },
        { numeral: 'V', name: 'Leave a note', station: stations.length - 1 },
    ]), [stations.length]);

    useEffect(() => {
        let raf;
        let camZ = 0;
        const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

        const onMouse = (e) => {
            tilt.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            tilt.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouse);

        let lastRoom = -1;

        const tick = () => {
            const vh = window.innerHeight;
            const doorEnd = vh * 1.4;
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - vh;

            // the parting wall
            const doorP = smooth(clamp(y / doorEnd, 0, 1));
            if (doorLRef.current) {
                doorLRef.current.style.transform = `translateX(${(-doorP * 104).toFixed(2)}%)`;
                doorRRef.current.style.transform = `translateX(${(doorP * 104).toFixed(2)}%)`;
                epigraphRef.current.style.opacity = clamp(1 - doorP * 1.8, 0, 1).toFixed(3);
                doorsRef.current.style.visibility = doorP >= 1 ? 'hidden' : 'visible';
            }

            // the dolly
            const progress = max > doorEnd ? clamp((y - doorEnd) / (max - doorEnd), 0, 1) : 0;
            const target = progress * totalZ;
            camZ += (target - camZ) * 0.055;

            tilt.x += (tilt.tx - tilt.x) * 0.03;
            tilt.y += (tilt.ty - tilt.y) * 0.03;

            if (worldRef.current) {
                worldRef.current.style.transform =
                    `rotateX(${(tilt.y * -0.8).toFixed(3)}deg) rotateY(${(tilt.x * 0.9).toFixed(3)}deg) translate3d(0,0,${camZ.toFixed(2)}px)`;
            }

            for (let i = 0; i < stations.length; i++) {
                const el = stationRefs.current[i];
                if (!el) continue;
                const dz = stations[i].z - camZ;
                const ahead = clamp(1 - (dz - GAP * 0.5) / (GAP * 1.6), 0, 1);
                const behind = clamp(1 + dz / 420, 0, 1);
                const o = Math.min(ahead, behind);
                el.style.opacity = o.toFixed(3);
                el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
                el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
                el.classList.toggle('near', dz < GAP * 1.05 && dz > -360);
            }

            if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
            }

            const current = clamp(Math.round(camZ / GAP), 0, stations.length - 1);
            if (current !== lastRoom) {
                lastRoom = current;
                setRoom(current);
            }

            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMouse);
        };
    }, [stations, totalZ]);

    const walkTo = (stationIdx) => {
        const vh = window.innerHeight;
        const doorEnd = vh * 1.4;
        const max = document.documentElement.scrollHeight - vh;
        const top = doorEnd + (stations[stationIdx].z / totalZ) * (max - doorEnd);
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const activeIndex = index.reduce((acc, n, i) => (room >= n.station ? i : acc), 0);

    return (
        <div className="pav">
            {/* the runway — scroll length drives the walk */}
            <div style={{ height: `${stations.length * 100 + 150}vh` }} />

            <div className="pav-viewport">
                <div className="pav-world" ref={worldRef}>
                    {/* architecture */}
                    <div className="pav-plane pav-floor" />
                    <div className="pav-plane pav-ceiling" />
                    <div className="pav-plane pav-wall left" />
                    <div className="pav-plane pav-wall right" />

                    {/* rooms */}
                    {stations.map((s, i) => (
                        <div
                            key={s.key}
                            ref={(el) => { stationRefs.current[i] = el; }}
                            className="pav-station"
                            style={{
                                transform:
                                    `translate(-50%, -50%) translate3d(${s.x}px, 0, ${-s.z}px) rotateY(${s.ry}deg)`,
                            }}
                        >
                            {s.node}
                        </div>
                    ))}
                </div>
            </div>

            <Dust />
            <div className="pav-vignette" />

            {/* the parting wall */}
            <div className="pav-doors" ref={doorsRef}>
                <div className="pav-door l" ref={doorLRef} />
                <div className="pav-door r" ref={doorRRef} />
                <div className="pav-epigraph" ref={epigraphRef}>
                    <blockquote>
                        Software is invisible.<br />Its architecture shouldn&rsquo;t be.
                    </blockquote>
                    <div className="hint">Scroll to enter</div>
                </div>
            </div>

            {/* interface — almost not there */}
            <div className="pav-ui">
                <div className="pav-wordmark">Ayush Kumar</div>
                <div className="pav-roomname">
                    {stations[room]?.numeral && <b>{stations[room].numeral}</b>}
                    {stations[room]?.room}
                </div>

                <nav className="pav-index">
                    {index.map((n, i) => (
                        <button
                            key={n.numeral}
                            className={i === activeIndex ? 'on' : ''}
                            onClick={() => walkTo(n.station)}
                        >
                            <span className="nm">{n.name}</span>
                            {n.numeral}
                        </button>
                    ))}
                </nav>

                <div className="pav-progress"><i ref={progressRef} /></div>
            </div>
        </div>
    );
}
