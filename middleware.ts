import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Edge Runtime compatible: use TextEncoder to get a Uint8Array secret
const getSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || 'dev-only-secret-change-in-production-32chars!!'
  );

const PUBLIC_PREFIXES = [
  '/api/v1/auth',
  '/portail',
  '/tarifs',
  '/login',
  '/admin/login',
  '/technicien/acces',
  '/technicien/login',
  '/_next',
  '/favicon',
];

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return request.cookies.get('auth-token')?.value ?? null;
}

async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicRoute(pathname)) return NextResponse.next();

  const token = extractToken(request);

  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const response = NextResponse.next();
    response.headers.set('x-user-id', String(decoded.userId ?? ''));
    response.headers.set('x-user-role', 'admin');
    return response;
  }

  if (pathname.startsWith('/entreprise') || pathname.startsWith('/technicien')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.redirect(new URL('/login', request.url));

    if (pathname.startsWith('/entreprise') && decoded.role !== 'pisciniste') {
      return NextResponse.redirect(new URL('/technicien', request.url));
    }

    if (
      pathname.startsWith('/technicien') &&
      !['technicien', 'pisciniste'].includes(String(decoded.role))
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const response = NextResponse.next();
    response.headers.set('x-tenant-id', String(decoded.tenantId ?? ''));
    response.headers.set('x-user-id', String(decoded.userId ?? ''));
    response.headers.set('x-user-role', String(decoded.role ?? ''));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
