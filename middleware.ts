import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/', '/index'],
}

const AUTH_USER = process.env["AUTH_USER"]
const AUTH_PASSWORD = process.env["AUTH_PASSWORD"]

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl
  if (!AUTH_USER) {
    return NextResponse.next()
  }

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === AUTH_USER && pwd === AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'

  console.log("url", url, "redirec")
  return NextResponse.rewrite(url)
}