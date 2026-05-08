import { NextRequest } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '@/lib/api/response';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || await bcryptjs.hash('admin123', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return errorResponse('Missing credentials', 400);
    }

    // Check username
    if (username !== ADMIN_USERNAME) {
      return errorResponse('Invalid credentials', 401);
    }

    // Check password
    const passwordMatch = await bcryptjs.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { admin: true, username, type: 'admin' },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    return successResponse({
      token,
      expiresIn: 1800,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return errorResponse('Internal server error', 500);
  }
}
