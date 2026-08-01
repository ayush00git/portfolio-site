import React, { useEffect, useRef } from 'react';

// Each line gets its own corner of the frame, so the eye moves as the voice does
const lines = [
  { text: "yo, i'm ayush.", at: 'top-left' },
  { text: "cs undergrad at nit hamirpur, class of '28.", at: 'top-right' },
  { text: 'i write go for fun, which is a whole personality, i know.', at: 'bottom-left' },
  {
    text: "i'm an apache committer on fory — the serializer alibaba, bytedance and warner bros run in prod.",
    at: 'top-right',
  },
  { text: 'i gave it float16 across go and js. cut the memory in half. the gpus said thanks.', at: 'bottom-right' },
  { text: 'also built its grpc-go codegen from scratch. zero-copy, no protobuf in sight.', at: 'top-left' },
  { text: 'my college estate office runs on a complaint portal i built.', at: 'bottom-left' },
  { text: '1000+ students registered through laca-web in 2 days. zero downtime. i did not sleep.', at: 'top-right' },
  {
    text: 'took stanza to the claude life sciences hackathon and landed top 10 — it designs molecules that outrun resistance mutations.',
    at: 'bottom-right',
  },
  { text: 'mostly i just like shipping stuff people actually use.', at: 'top-left' },
  { text: 'anyway. scroll for the receipts.', at: 'bottom-right' },
];

export const LINE_COUNT = lines.length;

// Standing-wave modes — the wave rings across these harmonics instead of just wobbling
const modes = [
  { k: 1, w: 2.1, a: 0.5 },
  { k: 3, w: 5.3, a: 0.27 },
  { k: 5, w: 8.7, a: 0.16 },
  { k: 8, w: 13.4, a: 0.09 },
];
const modeSum = modes.reduce((n, m) => n + m.a, 0);

const INK = '13,17,23';
const PAPER = '244,242,237';
const ACCENT = '255,61,0'; // burns through wherever a bar crosses a letterform
const RUNTIME = 96; // seconds of "footage" the timecode counts through

const timecode = (p) => {
  const frames = Math.floor(p * RUNTIME * 24);
  const pad = (n) => String(n).padStart(2, '0');
  const secs = Math.floor(frames / 24);
  return `00:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}:${pad(frames % 24)}`;
};

const easeOut = (x) => 1 - (1 - x) ** 3;

// Wrap the caption and place every word, in frame coordinates. The text is drawn
// on the canvas rather than in the DOM so the waveform can be masked to the
// actual glyph shapes.
const layoutCaption = (ctx, line, w, h) => {
  const size = Math.max(17, w * 0.038);
  const lead = size * 1.06;
  const maxW = w * 0.52;
  const padX = w * 0.06;

  ctx.font = `${size}px 'Instrument Serif', Georgia, serif`;
  const space = ctx.measureText(' ').width;

  const rows = [];
  let row = [];
  let rowW = 0;
  let n = 0;
  for (const text of line.text.split(' ')) {
    const width = ctx.measureText(text).width;
    if (row.length && rowW + space + width > maxW) {
      rows.push({ words: row, width: rowW });
      row = [];
      rowW = 0;
    }
    row.push({ text, width, i: n++ });
    rowW += (row.length > 1 ? space : 0) + width;
  }
  if (row.length) rows.push({ words: row, width: rowW });

  const blockH = rows.length * lead;
  const right = line.at.endsWith('right');
  const top = line.at.startsWith('top') ? h * 0.15 : h - h * 0.18 - blockH;

  const placed = [];
  rows.forEach((r, ri) => {
    let x = right ? w - padX - r.width : padX;
    const y = top + ri * lead;
    for (const word of r.words) {
      placed.push({ ...word, x, y });
      x += word.width + space;
    }
  });

  const blockX = right ? w - padX - Math.max(...rows.map((r) => r.width)) : padX;
  return { size, lead, words: placed, count: n, top, blockH, blockX, right, padX };
};

const VoiceIntro = ({ progressRef }) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const fadeRef = useRef(null);
  const tcRef = useRef(null);
  const barRef = useRef(null);
  const s = useRef({ index: -1, energy: 0, lastProgress: 0, ripple: 99, layout: null, w: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    const ctx = canvas.getContext('2d');
    // Glyph layer doubles as the mask; accent layer gets clipped to it
    const glyph = document.createElement('canvas');
    const gctx = glyph.getContext('2d');
    const hot = document.createElement('canvas');
    const hctx = hot.getContext('2d');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = frame.getBoundingClientRect();
      for (const [c, x] of [
        [canvas, ctx],
        [glyph, gctx],
        [hot, hctx],
      ]) {
        c.width = width * dpr;
        c.height = height * dpr;
        x.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      s.current.layout = null;
    };
    resize();
    window.addEventListener('resize', resize);

    // Instrument Serif may land after first paint — re-measure when it does
    document.fonts?.ready.then(() => {
      s.current.layout = null;
    });

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      const st = s.current;

      const progress = progressRef?.current?.progress ?? 0;
      // Per second, not per frame, so the feel is independent of track length
      const velocity = dt > 0 ? Math.abs(progress - st.lastProgress) / dt : 0;
      st.lastProgress = progress;

      // Scroll lifts the wave gently; it never switches it on or off
      const drive = Math.min(1, velocity * 6);
      st.energy += (drive - st.energy) * Math.min(1, dt * 3.2);

      const lineFloat = progress * lines.length;
      const index = Math.min(lines.length - 1, Math.floor(lineFloat));
      const within = lineFloat - Math.floor(lineFloat);
      if (index !== st.index) {
        st.index = index;
        st.ripple = 0;
        st.layout = null;
      }
      st.ripple += dt;

      // The frame splits open from the middle on its own scroll beat
      const reveal = Math.min(1, Math.max(0, progressRef?.current?.open ?? 1));
      const shut = (1 - reveal) * 50;
      frame.style.clipPath = `inset(${shut}% 0% ${shut}% 0%)`;
      if (fadeRef.current) {
        const tailOut = Math.min(1, Math.max(0, (1 - progress) / 0.04));
        fadeRef.current.style.opacity = String(1 - Math.min(reveal, tailOut));
      }
      if (tcRef.current) tcRef.current.textContent = timecode(progress);
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const { width, height } = canvas.getBoundingClientRect();
      const mid = height / 2;

      if (!st.layout || st.w !== width) {
        st.layout = layoutCaption(gctx, lines[index], width, height);
        st.w = width;
      }
      const L = st.layout;

      ctx.clearRect(0, 0, width, height);
      gctx.clearRect(0, 0, width, height);
      hctx.clearRect(0, 0, width, height);

      // ── Waveform ──────────────────────────────────────────────────────────
      const breath =
        0.6 + 0.4 * (Math.sin(t * 1.7) * 0.5 + 0.5) * (Math.sin(t * 0.9 + 1.1) * 0.5 + 0.5);
      const amp = reduced ? 0.35 : (0.42 + st.energy * 0.5) * breath;
      const rippleGain = Math.exp(-2.6 * st.ripple);

      const gap = 5;
      const barW = 2;
      const step = barW + gap;
      const count = Math.floor(width / step);
      const maxH = height * 0.64;

      for (let i = 0; i < count; i++) {
        const x = i * step + gap / 2;
        const p = i / (count - 1);
        const win = Math.sin(Math.PI * p) ** 0.32;

        let standing = 0;
        for (const m of modes) {
          standing +=
            m.a * Math.abs(Math.sin(m.k * Math.PI * p)) * (0.45 + 0.55 * Math.sin(t * m.w + m.k));
        }
        standing /= modeSum;

        const wobble =
          (Math.sin(i * 0.28 + t * 3.1) * 0.5 + 0.5) * 0.55 +
          (Math.sin(i * 0.61 - t * 2.2) * 0.5 + 0.5) * 0.45;
        const shape = standing * 0.42 + wobble * 0.58;

        const fromCenter = Math.abs(p - 0.5) * 2;
        const ripple =
          rippleGain > 0.01
            ? Math.max(0, Math.cos((fromCenter * 5 - st.ripple * 6.5) * Math.PI)) * rippleGain * 0.35
            : 0;

        const h = Math.max(1, (amp * (0.25 + 0.75 * shape) + ripple) * win * maxH);
        const heat = Math.min(1, h / maxH);

        ctx.fillStyle = `rgba(${INK},${0.2 + 0.6 * heat})`;
        ctx.fillRect(x, mid - h, barW, h * 2);

        // Same bar, accent, on the layer that will be clipped to the letterforms
        hctx.fillStyle = `rgb(${ACCENT})`;
        hctx.fillRect(x, mid - h, barW, h * 2);
      }

      // Edges dissolve back into the paper
      const vignette = ctx.createRadialGradient(
        width / 2,
        mid,
        Math.min(width, height) * 0.28,
        width / 2,
        mid,
        Math.max(width, height) * 0.62
      );
      vignette.addColorStop(0, `rgba(${PAPER},0)`);
      vignette.addColorStop(1, `rgba(${PAPER},0.88)`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // ── Caption ───────────────────────────────────────────────────────────
      const lineFade = within > 0.88 ? 1 - (within - 0.88) / 0.12 : 1;
      gctx.textBaseline = 'top';

      // Cue mark, letter-spaced by hand since canvas spacing is patchy
      gctx.save();
      gctx.globalAlpha = 0.45 * lineFade;
      gctx.fillStyle = `rgb(${INK})`;
      gctx.font = `${Math.max(8, L.size * 0.17)}px 'JetBrains Mono', monospace`;
      let cx = L.blockX;
      for (const ch of `CUE ${String(index + 1).padStart(2, '0')}`) {
        gctx.fillText(ch, cx, L.top - L.size * 0.75);
        cx += gctx.measureText(ch).width + L.size * 0.06;
      }
      gctx.restore();

      gctx.font = `${L.size}px 'Instrument Serif', Georgia, serif`;
      gctx.fillStyle = `rgb(${INK})`;
      for (const word of L.words) {
        // Words are uncovered by scrolling, each on its own overlapping window
        const start = (word.i / L.count) * 0.55;
        const wp = easeOut(Math.min(1, Math.max(0, (within - start) / 0.28)));
        if (wp <= 0) continue;

        // Each starts at its own height along a wave, so the line opens undulating
        const dy = (1 - wp) * L.size * (0.45 + Math.sin(word.i * 0.9) * 0.35);
        gctx.save();
        gctx.globalAlpha = wp * lineFade;
        if (!reduced && wp < 1) gctx.filter = `blur(${(1 - wp) * 12}px)`;
        gctx.fillText(word.text, word.x, word.y + dy);
        gctx.restore();
      }

      // Keep the accent only where a bar and a glyph share pixels
      hctx.globalCompositeOperation = 'destination-in';
      hctx.drawImage(glyph, 0, 0, width, height);
      hctx.globalCompositeOperation = 'source-over';

      ctx.drawImage(glyph, 0, 0, width, height);
      ctx.drawImage(hot, 0, 0, width, height);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [progressRef]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none flex items-center justify-center">
      {/* The frame — a true 2.39:1 crop, so the black above and below is real letterbox */}
      <div
        ref={frameRef}
        className="film-grain relative w-full bg-[#F4F2ED] overflow-hidden"
        style={{ aspectRatio: '2.39 / 1', maxHeight: '100%' }}
      >
        {/* Waveform and caption both live here */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Registration marks at the frame corners */}
        <span className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#0D1117]/25 pointer-events-none" />
        <span className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#0D1117]/25 pointer-events-none" />
        <span className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#0D1117]/25 pointer-events-none" />
        <span className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#0D1117]/25 pointer-events-none" />

        {/* Fade to black at the tail */}
        <div ref={fadeRef} className="absolute inset-0 z-10 bg-black pointer-events-none" />

        {/* Slate — above the fade, so the reel reads as cued up rather than broken */}
        <div className="absolute top-5 left-12 z-20 font-jb text-[9px] tracking-[0.35em] uppercase text-white/50 mix-blend-difference pointer-events-none">
          reel 01 · intro
        </div>
        <div
          ref={tcRef}
          className="absolute top-5 right-12 z-20 font-jb text-[9px] tracking-[0.3em] text-white/50 mix-blend-difference pointer-events-none"
        >
          00:00:00:00
        </div>
        <div className="absolute bottom-5 left-12 z-20 font-jb text-[9px] tracking-[0.35em] uppercase text-white/40 mix-blend-difference pointer-events-none">
          2.39:1 · scroll to play
        </div>

        {/* Footage progress */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10 mix-blend-difference">
          <div ref={barRef} className="h-full w-full bg-white/70 origin-left scale-x-0" />
        </div>
      </div>
    </div>
  );
};

export default VoiceIntro;
