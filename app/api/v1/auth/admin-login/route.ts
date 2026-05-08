import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock admin credentials (in production, use database)
const ADMIN_CREDENTIALS = {
  'admin@pooltrack.com': { password: 'admin123', name: 'Administrateur PoolTrack' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const admin = ADMIN_CREDENTIALS[email as keyof typeof ADMIN_CREDENTIALS];

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      {
        userId: 'admin-pooltrack',
        role: 'admin',
        email: email,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      role: 'admin',
      userName: admin.name,
      message: 'Connecté en tant qu\'administrateur',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
