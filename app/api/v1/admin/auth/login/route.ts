import { NextRequest } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';
import { successResponse, errorResponse } from '@/lib/api/response';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH =
  env.ADMIN_PASSWORD_HASH ||
  (env.NODE_ENV !== 'production' ? bcryptjs.hashSync('admin123', 10) : null);

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  const { allowed, resetAt } = checkRateLimit(`admin-auth:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt);

  try {
    const { username, password } = await request.json();

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return errorResponse('Missing credentials', 400);
    }

    if (!ADMIN_PASSWORD_HASH) {
      console.error('[Security] ADMIN_PASSWORD_HASH not configured in production');
      return errorResponse('Service unavailable', 503);
    }

    const usernameMatch = username === ADMIN_USERNAME;
    const passwordMatch = usernameMatch && await bcryptjs.compare(password, ADMIN_PASSWORD_HASH);

    if (!usernameMatch || !passwordMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { admin: true, username: ADMIN_USERNAME, type: 'admin' },
      env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return successResponse({ token, expiresIn: 7200 });
  } catch (error) {
    console.error('Admin login error:', error);
    return errorResponse('Internal server error', 500);
  }
}
