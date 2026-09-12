import { NextRequest, NextResponse } from 'next/server'
import { isEvent, recordEvent } from '../../../lib/monitor'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: { event?: unknown; referrer?: unknown } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  if (!isEvent(body.event)) return NextResponse.json({ ok: false }, { status: 400 })

  const ok = await recordEvent({
    event: body.event,
    at: new Date().toISOString(),
    country: req.headers.get('x-vercel-ip-country') ?? '',
    referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 200) : '',
    ua: (req.headers.get('user-agent') ?? '').slice(0, 200),
  })
  return NextResponse.json({ ok })
}
