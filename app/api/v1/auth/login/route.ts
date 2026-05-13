import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '@/lib/env';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

// Demo users with bcrypt-hashed passwords.
// Hash of 'password123' with cost 10.
// To regenerate: node -e "require('bcryptjs').hash('password123',10).then(console.log)"
const MOCK_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const mockUsers = [
  {
    id: 'user_1',
    email: 'pisciniste@example.com',
    passwordHash: MOCK_PASSWORD_HASH,
    role: 'pisciniste',
    tenantId: 'tenant_1',
    name: 'Jean Dupont',
  },
  {
    id: 'user_2',
    email: 'technicien@example.com',
    passwordHash: MOCK_PASSWORD_HASH,
    role: 'technicien',
    tenantId: 'tenant_1',
    name: 'Karim Benali',
  },
  {
    id: 'user_3',
    email: 'lucas.moreau@pooltrack.fr',
    passwordHash: MOCK_PASSWORD_HASH,
    role: 'technicien',
    tenantId: 'tenant_1',
    name: 'Lucas Moreau',
  },
];

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  const rateKey = `login:${ip}`;
  const { allowed, resetAt } = checkRateLimit(rateKey, 10, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Always run bcrypt compare to prevent timing attacks
    const validPassword = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, MOCK_PASSWORD_HASH);

    if (!user || !validPassword) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        type: 'user',
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const res = NextResponse.json({
      success: true,
      token,
      role: user.role,
      tenantId: user.tenantId,
      userName: user.name,
    });

    // Set cookie so middleware can authenticate page-route requests.
    // Non-httpOnly so the client can clear it on logout.
    res.cookies.set('auth-token', token, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion' }, { status: 500 });
  }
}
