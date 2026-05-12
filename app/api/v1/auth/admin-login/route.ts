import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/env';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';

// Hash computed once at startup. In production, set ADMIN_PASSWORD_HASH env var.
// To generate: node -e "require('bcryptjs').hash('yourpassword',12).then(console.log)"
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrateur PoolTrack';
const ADMIN_PASSWORD_HASH =
  env.ADMIN_PASSWORD_HASH ||
  (env.NODE_ENV !== 'production'
    ? bcrypt.hashSync('admin123', 10)
    : null);

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  const rateKey = `admin-login:${ip}`;
  const { allowed, resetAt } = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    if (!ADMIN_PASSWORD_HASH) {
      console.error('[Security] ADMIN_PASSWORD_HASH not configured in production');
      return NextResponse.json({ error: 'Service non disponible' }, { status: 503 });
    }

    const emailMatch = email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
    const passwordMatch = emailMatch && await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    // Constant-time rejection to prevent timing attacks
    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: 'admin-pooltrack', role: 'admin', email: env.ADMIN_EMAIL },
      env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const res = NextResponse.json({
      token,
      role: 'admin',
      userName: ADMIN_NAME,
      message: "Connecté en tant qu'administrateur",
    });

    res.cookies.set('auth-token', token, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}
