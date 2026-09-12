'use client'

import { useEffect } from 'react'
import { track } from '../lib/track'
import type { EventName } from '../lib/monitor'

// Counts a real render of the page, which prefetches and bots fetching the
// HTML never trigger
export const PageView = ({ event }: { event: EventName }) => {
  useEffect(() => {
    track(event)
  }, [event])
  return null
}
