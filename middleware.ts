import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register']
const ONBOARDING_PATH = '/onboarding'
const SELECT_TENANT_PATH = '/select-tenant'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('agentesia-token')?.value
  const isAuthenticated = !!token

  // Leer info adicional del estado persistido en localStorage (pasado via cookie separada)
  let hasTenant = false
  let hasMultipleTenants = false

  const authRaw = request.cookies.get('agentesia-auth-meta')?.value
  if (authRaw) {
    try {
      const parsed = JSON.parse(authRaw)
      hasTenant = !!parsed?.hasTenant
      hasMultipleTenants = !!parsed?.hasMultipleTenants
    } catch { /* ignore */ }
  }

  // Landing page: si ya está autenticado, ir al app
  if (pathname === '/') {
    if (isAuthenticated) return NextResponse.redirect(new URL('/catalog', request.url))
    return NextResponse.next()
  }

  // Rutas públicas (login/register)
  if (PUBLIC_PATHS.includes(pathname)) {
    if (!isAuthenticated) return NextResponse.next()
    if (hasMultipleTenants && !hasTenant) return NextResponse.redirect(new URL(SELECT_TENANT_PATH, request.url))
    return NextResponse.redirect(new URL('/catalog', request.url))
  }

  // Onboarding y select-tenant: requieren token
  if (pathname === ONBOARDING_PATH || pathname === SELECT_TENANT_PATH) {
    if (!isAuthenticated) return NextResponse.redirect(new URL('/login', request.url))
    return NextResponse.next()
  }

  // Dashboard: requiere token
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}
