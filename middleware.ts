import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes (no auth needed)
  const publicRoutes = ['/api/v1/auth', '/portail', '/tarifs', '/', '/login', '/admin/login'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Admin routes require special 'admin' role
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      response.headers.set('x-user-id', decoded.userId);
      response.headers.set('x-user-role', decoded.role);
      return response;
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protected routes - Check authentication
  const response = NextResponse.next();
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to login if accessing protected routes without token
    if (pathname.startsWith('/entreprise') || pathname.startsWith('/technicien')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if user role matches the route
    if (pathname.startsWith('/entreprise') && decoded.role !== 'pisciniste') {
      return NextResponse.redirect(new URL('/technicien', request.url));
    }

    if (pathname.startsWith('/technicien') && !['technicien', 'pisciniste'].includes(decoded.role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Add tenant ID to header for API routes
    if (pathname.startsWith('/api')) {
      response.headers.set('x-tenant-id', decoded.tenantId);
      response.headers.set('x-user-id', decoded.userId);
      response.headers.set('x-user-role', decoded.role);
    }

    return response;
  } catch (error) {
    console.error('Token verification failed:', error);

    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }
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
