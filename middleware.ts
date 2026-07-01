import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  detectRequestLocale,
  getLocaleFromPathname,
  LANGUAGE_COOKIE_KEY,
} from './lib/l10n'

function shouldRedirectToLocalePath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/articles' ||
    pathname.startsWith('/articles/') ||
    pathname.startsWith('/doctor/')
  )
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const pathnameLocale = getLocaleFromPathname(pathname)

  if (pathnameLocale) {
    const response = NextResponse.next()
    response.cookies.set(LANGUAGE_COOKIE_KEY, pathnameLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  if (!shouldRedirectToLocalePath(pathname)) {
    return NextResponse.next()
  }

  const locale = detectRequestLocale(
    request.cookies.get(LANGUAGE_COOKIE_KEY)?.value,
    request.headers.get('accept-language'),
  )
  const target = new URL(`/${locale}${pathname === '/' ? '' : pathname}${search}`, request.url)
  const response = NextResponse.redirect(target)

  response.cookies.set(LANGUAGE_COOKIE_KEY, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
