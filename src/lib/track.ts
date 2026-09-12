import type { EventName } from './monitor'

/** Fire-and-forget beacon to /api/track. Survives page unloads, never throws. */
export const track = (event: EventName) => {
  try {
    const payload = JSON.stringify({ event, referrer: document.referrer })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track', { method: 'POST', body: payload, headers: { 'content-type': 'application/json' }, keepalive: true })
    }
  } catch {
    // analytics must never break the page
  }
}
