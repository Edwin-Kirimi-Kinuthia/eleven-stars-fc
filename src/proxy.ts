import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIES = [
  'authjs.session-token',
  'next-auth.session-token',
  '__Secure-authjs.session-token',
  '__Secure-next-auth.session-token',
]

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? 'elevenstars-dev-secret-change-in-production'
)

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()

    const raw = SESSION_COOKIES.map(n => request.cookies.get(n)?.value).find(Boolean)
    if (!raw) return NextResponse.redirect(new URL('/admin/login', request.url))

    try {
      const { payload } = await jwtVerify(raw, SECRET)
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
