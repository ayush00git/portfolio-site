import React from 'react'
import type { Metadata } from 'next'
import { readSnapshot, EVENTS, type EventName } from '../../lib/monitor'

export const metadata: Metadata = { title: 'monitor', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

const LABELS: Record<EventName, string> = {
  home: 'home views',
  projects: 'projects views',
  resume: 'resume clicks',
}

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })

// Rough device label from the user agent, enough to tell phones from laptops
const device = (ua: string) => (/Mobi|Android|iPhone/i.test(ua) ? 'mobile' : /bot|crawl|spider/i.test(ua) ? 'bot' : 'desktop')

// Access is enforced in src/middleware.ts: MONITOR_KEY must be set and the
// visitor must have unlocked the page once with ?key=<MONITOR_KEY>
export default async function MonitorPage() {
  const snap = await readSnapshot(14)

  return (
    <main className="min-h-screen bg-black text-white font-sans px-[4vw] pt-[10vh] pb-[24vh] selection:bg-emerald-500/30">
      <header className="mb-[6vh]">
        <span className="text-[10px] tracking-[0.35em] uppercase text-white/45">monitor</span>
        <h1 className="mt-3 font-display text-[10vw] md:text-[6vw] leading-[0.9] lowercase tracking-[-0.04em]">who came by</h1>
      </header>

      {!snap ? (
        <p className="max-w-md text-sm leading-relaxed text-white/60 font-inter">
          No database configured. Add an Upstash Redis store to the Vercel project so <code>KV_REST_API_URL</code> and{' '}
          <code>KV_REST_API_TOKEN</code> are set, then redeploy.
        </p>
      ) : (
        <>
          {/* Lifetime totals */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {EVENTS.map((e) => (
              <div key={e} className="bg-black p-6">
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/45">{LABELS[e]}</div>
                <div className="mt-3 font-display text-[12vw] sm:text-[4.5vw] leading-none tabular-nums text-emerald-400">{snap.totals[e]}</div>
              </div>
            ))}
          </section>

          {/* Last 14 days */}
          <section className="mt-[8vh]">
            <div className="mb-4 text-[10px] tracking-[0.35em] uppercase text-white/45">last 14 days, utc</div>
            <div className="overflow-x-auto border-t border-white/15">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="text-left text-[10px] tracking-[0.25em] uppercase text-white/45">
                    <th className="py-3 pr-6 font-normal">date</th>
                    {EVENTS.map((e) => (
                      <th key={e} className="py-3 pr-6 font-normal">{e}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snap.days.map((d) => (
                    <tr key={d.date} className="border-t border-white/10">
                      <td className="py-2.5 pr-6 text-white/70">{d.date}</td>
                      {EVENTS.map((e) => (
                        <td key={e} className={`py-2.5 pr-6 ${d.counts[e] ? 'text-white' : 'text-white/25'}`}>{d.counts[e]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent events */}
          <section className="mt-[8vh]">
            <div className="mb-4 text-[10px] tracking-[0.35em] uppercase text-white/45">recent, ist</div>
            <div className="overflow-x-auto border-t border-white/15">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] tracking-[0.25em] uppercase text-white/45">
                    <th className="py-3 pr-6 font-normal">when</th>
                    <th className="py-3 pr-6 font-normal">event</th>
                    <th className="py-3 pr-6 font-normal">from</th>
                    <th className="py-3 pr-6 font-normal">device</th>
                    <th className="py-3 pr-6 font-normal">referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {snap.recent.length === 0 && (
                    <tr className="border-t border-white/10">
                      <td colSpan={5} className="py-4 text-white/40">nothing yet</td>
                    </tr>
                  )}
                  {snap.recent.map((r, i) => (
                    <tr key={`${r.at}-${i}`} className="border-t border-white/10">
                      <td className="py-2.5 pr-6 whitespace-nowrap text-white/70">{fmtTime(r.at)}</td>
                      <td className="py-2.5 pr-6" style={{ color: r.event === 'resume' ? '#34d399' : undefined }}>{r.event}</td>
                      <td className="py-2.5 pr-6 text-white/70">{r.country || '—'}</td>
                      <td className="py-2.5 pr-6 text-white/70">{device(r.ua)}</td>
                      <td className="py-2.5 pr-6 max-w-[40vw] truncate text-white/50 font-inter">{r.referrer || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
