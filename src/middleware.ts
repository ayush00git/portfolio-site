import { NextRequest, NextResponse } from 'next/server'

/* ── /monitor gate ─────────────────────────────────────────────────────────
   Private unless MONITOR_KEY is set and the visitor presents it. The first
   visit with ?key=<MONITOR_KEY> swaps the key for an httpOnly cookie and
   redirects to the clean URL; after that the cookie alone unlocks the page.
   Anything else gets a 404, indistinguishable from the route not existing.
   ──────────────────────────────────────────────────────────────────────── */

const COOKIE = 'monitor_key'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// Constant-time compare so the key cannot be guessed character by character
const same = (a: string, b: string) => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function middleware(req: NextRequest) {
  const secret = process.env.MONITOR_KEY
  const notFound = () => NextResponse.rewrite(new URL('/404', req.url), { status: 404 })
  if (!secret) return notFound()

  const cookie = req.cookies.get(COOKIE)?.value ?? ''
  if (same(cookie, secret)) return NextResponse.next()

  const key = req.nextUrl.searchParams.get('key') ?? ''
  if (same(key, secret)) {
    const clean = req.nextUrl.clone()
    clean.searchParams.delete('key')
    const res = NextResponse.redirect(clean)
    res.cookies.set(COOKIE, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/monitor',
      maxAge: MAX_AGE,
    })
    return res
  }

  return notFound()
}

export const config = { matcher: ['/monitor', '/monitor/:path*'] }
