import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';

// Demo proprietaire emails. In production, query the database.
const VALID_PROPRIETAIRES: Record<string, { id: string; name: string }> = {
  'proprietaire@example.com': { id: 'prop-1', name: 'Monsieur Dupont' },
  'client@example.com': { id: 'prop-2', name: 'Marie Martin' },
};

// Tokens stored in memory with one-time-use enforcement.
// Replace with Redis/DB for multi-instance deployments.
const MAGIC_TOKENS = new Map<string, { email: string; expiresAt: number; used: boolean }>();

function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  MAGIC_TOKENS.forEach((data, token) => {
    if (data.expiresAt < now) MAGIC_TOKENS.delete(token);
  });
}, 60 * 1000);

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  const rateKey = `magic-link:${ip}`;
  const { allowed, resetAt } = checkRateLimit(rateKey, 5, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return the same response to prevent email enumeration
    const proprietaire = VALID_PROPRIETAIRES[normalizedEmail];

    if (!proprietaire) {
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse email est enregistrée, un lien de connexion a été envoyé',
      });
    }

    const token = generateSecureToken();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    MAGIC_TOKENS.set(token, { email: normalizedEmail, expiresAt, used: false });

    const magicLink = `/portail/${token}`;

    // In development, expose the link for testing. In production, send by email.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Dev] Magic link for ${normalizedEmail}: ${magicLink}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Lien de connexion envoyé à votre email',
      ...(process.env.NODE_ENV !== 'production' ? { token: magicLink } : {}),
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du lien' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token requis' }, { status: 400 });
    }

    const tokenData = MAGIC_TOKENS.get(token);

    if (!tokenData || tokenData.expiresAt < Date.now() || tokenData.used) {
      return NextResponse.json({ error: 'Lien expiré ou déjà utilisé' }, { status: 401 });
    }

    // Mark as used immediately (one-time use)
    tokenData.used = true;

    const proprietaire = VALID_PROPRIETAIRES[tokenData.email];

    if (!proprietaire) {
      return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      email: tokenData.email,
      proprietaireId: proprietaire.id,
      name: proprietaire.name,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 });
  }
}
