import { Redis } from '@upstash/redis'

/* ── Visit tracking ────────────────────────────────────────────────────────
   Counters live in Upstash Redis (Vercel Marketplace). Three events: a view
   of the home page, a view of the projects page, and a click on the resume
   link in the dock. Each keeps a lifetime total, a per-day total, and the
   last 200 events for the table on /monitor.
   ──────────────────────────────────────────────────────────────────────── */

export const EVENTS = ['home', 'projects', 'resume'] as const
export type EventName = (typeof EVENTS)[number]

export interface MonitorEvent {
  event: EventName
  at: string
  country: string
  referrer: string
  ua: string
}

const LOG_KEY = 'monitor:log'
const LOG_LIMIT = 200

// The Vercel integration exposes KV_* names, a manual Upstash setup UPSTASH_*
export const getRedis = (): Redis | null => {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  // `vercel env pull` writes "[SENSITIVE]" for hidden secrets; treat that as unset
  if (!url || !token || !url.startsWith('https://')) return null
  return new Redis({ url, token })
}

export const isEvent = (x: unknown): x is EventName => typeof x === 'string' && (EVENTS as readonly string[]).includes(x)

const day = (d = new Date()) => d.toISOString().slice(0, 10)

export const recordEvent = async (e: MonitorEvent) => {
  const redis = getRedis()
  if (!redis) return false
  const p = redis.pipeline()
  p.incr(`monitor:total:${e.event}`)
  p.incr(`monitor:day:${e.event}:${day()}`)
  p.lpush(LOG_KEY, JSON.stringify(e))
  p.ltrim(LOG_KEY, 0, LOG_LIMIT - 1)
  await p.exec()
  return true
}

export interface MonitorSnapshot {
  totals: Record<EventName, number>
  days: { date: string; counts: Record<EventName, number> }[]
  recent: MonitorEvent[]
}

export const readSnapshot = async (daysBack = 14): Promise<MonitorSnapshot | null> => {
  const redis = getRedis()
  if (!redis) return null

  const dates = Array.from({ length: daysBack }, (_, i) => {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    return day(d)
  })

  const keys = [
    ...EVENTS.map((e) => `monitor:total:${e}`),
    ...dates.flatMap((d) => EVENTS.map((e) => `monitor:day:${e}:${d}`)),
  ]
  const [values, log] = await Promise.all([
    redis.mget<(number | null)[]>(...keys),
    redis.lrange<string | MonitorEvent>(LOG_KEY, 0, LOG_LIMIT - 1),
  ])

  const n = (v: number | null | undefined) => Number(v ?? 0)
  const totals = Object.fromEntries(EVENTS.map((e, i) => [e, n(values[i])])) as Record<EventName, number>
  const days = dates.map((date, di) => ({
    date,
    counts: Object.fromEntries(EVENTS.map((e, ei) => [e, n(values[EVENTS.length + di * EVENTS.length + ei])])) as Record<EventName, number>,
  }))
  // The client may already have parsed the JSON for us
  const recent = log.map((x) => (typeof x === 'string' ? (JSON.parse(x) as MonitorEvent) : x))

  return { totals, days, recent }
}
