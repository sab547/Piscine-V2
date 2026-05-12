import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';

// Tech codes loaded from env var (comma-separated JSON) or dev defaults.
// Format: TECH_CODES='{"TECH01":{"piscinistId":"p-1","name":"Code 1"}}'
function loadTechCodes(): Record<string, { piscinistId: string; name: string }> {
  if (process.env.TECH_CODES) {
    try {
      return JSON.parse(process.env.TECH_CODES);
    } catch {
      console.error('[Security] Invalid TECH_CODES env var format');
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('[Security] TECH_CODES not configured in production');
    return {};
  }

  // Dev defaults only
  return {
    'TECH01': { piscinistId: 'pisciniste-1', name: 'Technician Access Code 1' },
    'TECH02': { piscinistId: 'pisciniste-2', name: 'Technician Access Code 2' },
    'POOL99': { piscinistId: 'pisciniste-1', name: 'Test Access Code' },
  };
}

const VALID_TECH_CODES = loadTechCodes();

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  // Strict rate limit: 5 attempts per 15 minutes per IP
  const rateKey = `tech-code:${ip}`;
  const { allowed, resetAt } = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: "Code d'accès requis" }, { status: 400 });
    }

    const normalizedCode = code.toUpperCase().trim();

    if (normalizedCode.length < 4 || normalizedCode.length > 16) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
    }

    const codeData = VALID_TECH_CODES[normalizedCode];

    if (!codeData) {
      return NextResponse.json({ error: "Code d'accès invalide" }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      piscinistId: codeData.piscinistId,
      message: 'Code accepté, veuillez vous connecter',
    });
  } catch (error) {
    console.error('Tech code validation error:', error);
    return NextResponse.json({ error: 'Erreur lors de la validation du code' }, { status: 500 });
  }
}
