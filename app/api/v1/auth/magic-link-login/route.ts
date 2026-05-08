import { NextRequest, NextResponse } from 'next/server';

// Mock proprietaire emails (in production, query database)
const VALID_PROPRIETAIRES = {
  'proprietaire@example.com': { id: 'prop-1', name: 'Monsieur Dupont', piscines: ['Piscine Privée'] },
  'client@example.com': { id: 'prop-2', name: 'Marie Martin', piscines: ['Piscine Municipale'] },
};

// Mock tokens storage (in production, use Redis or database with expiration)
const MAGIC_TOKENS: Record<string, { email: string; expiresAt: number }> = {};

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const proprietaire = VALID_PROPRIETAIRES[email as keyof typeof VALID_PROPRIETAIRES];

    if (!proprietaire) {
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse email est enregistrée, un lien de connexion a été envoyé',
      });
    }

    const token = generateToken();
    const expiresAt = Date.now() + 1000 * 60 * 15;
    
    MAGIC_TOKENS[token] = {
      email,
      expiresAt,
    };

    const magicLink = `/portail/${token}`;
    console.log(`Magic link for ${email}: ${magicLink}`);

    return NextResponse.json({
      success: true,
      message: 'Lien de connexion envoyé à votre email',
      token: magicLink,
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du lien' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 400 });
    }

    const tokenData = MAGIC_TOKENS[token];

    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return NextResponse.json({ error: 'Lien expiré' }, { status: 401 });
    }

    const proprietaire = VALID_PROPRIETAIRES[tokenData.email as keyof typeof VALID_PROPRIETAIRES];

    delete MAGIC_TOKENS[token];

    return NextResponse.json({
      valid: true,
      email: tokenData.email,
      proprietaireId: proprietaire.id,
      name: proprietaire.name,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
