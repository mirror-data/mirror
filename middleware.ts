import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/',
    '/((?!api|static|favicon.ico).*)',
  ],
}

export function middleware(req: NextRequest) {
  const auth = process.env.BASIC_AUTH
  if (!auth) {
    return NextResponse.next()
  }
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    const [u, w] = auth.split(':')
    if (user === u && pwd === w) {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}