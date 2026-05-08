import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink } from '@/lib/auth/verifyMagicLink';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    const decoded = verifyMagicLink(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    const response = NextResponse.json(
      { success: true, message: 'Vérification réussie' },
      { status: 200 }
    );

    // Set secure session cookie (7 days)
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Also set passage context if available
    if (decoded.passageId) {
      response.cookies.set({
        name: 'passage-id',
        value: decoded.passageId,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 400 }
    );
  }
}
