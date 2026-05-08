import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Mock user database - TODO: Replace with actual database queries
const mockUsers = [
  {
    id: 'user_1',
    email: 'pisciniste@example.com',
    password: 'password123', // TODO: Use bcrypt hash
    role: 'pisciniste',
    tenantId: 'tenant_1',
    name: 'Jean Dupont',
  },
  {
    id: 'user_2',
    email: 'technicien@example.com',
    password: 'password123',
    role: 'technicien',
    tenantId: 'tenant_1',
    name: 'Pierre Martin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // TODO: Query actual database
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        type: 'user',
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token,
      role: user.role,
      tenantId: user.tenantId,
      userName: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 400 }
    );
  }
}
