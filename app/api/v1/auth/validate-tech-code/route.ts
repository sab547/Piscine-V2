import { NextRequest, NextResponse } from 'next/server';

// Mock technician access codes (in production, this would be in the database)
const VALID_TECH_CODES: Record<string, { piscinistId: string; name: string }> = {
  'TECH01': { piscinistId: 'pisciniste-1', name: 'Technician Access Code 1' },
  'TECH02': { piscinistId: 'pisciniste-2', name: 'Technician Access Code 2' },
  'POOL99': { piscinistId: 'pisciniste-1', name: 'Test Access Code' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code d\'accès requis' },
        { status: 400 }
      );
    }

    const normalizedCode = code.toUpperCase().trim();

    if (normalizedCode.length !== 6) {
      return NextResponse.json(
        { error: 'Le code doit contenir 6 caractères' },
        { status: 400 }
      );
    }

    const codeData = VALID_TECH_CODES[normalizedCode];

    if (!codeData) {
      return NextResponse.json(
        { error: 'Code d\'accès invalide' },
        { status: 401 }
      );
    }

    // Code is valid
    return NextResponse.json({
      valid: true,
      piscinistId: codeData.piscinistId,
      message: 'Code accepté, veuillez vous connecter',
    });
  } catch (error) {
    console.error('Tech code validation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation du code' },
      { status: 500 }
    );
  }
}
