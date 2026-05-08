import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // Exclude public routes from auth middleware
  const publicRoutes = ['/api/auth', '/portail', '/tarifs', '/', '/login', '/piscines', '/planning', '/passage', '/rapports', '/anomalies', '/parametres'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return response;
  }

  // TODO: Implement auth check and tenantId injection
  // For now, these are stubs
  // const token = request.cookies.get('auth-token')?.value;
  // const user = await verifyToken(token);
  // const tenantId = user?.tenantId;

  // Set tenantId header for API routes
  // response.headers.set('x-tenant-id', tenantId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
