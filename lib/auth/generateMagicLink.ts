import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export function generateMagicLink(passageId: string, proprietaireId: string): string {
  const token = jwt.sign(
    { passageId, proprietaireId, type: 'magic_link' },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/portail/verify?token=${token}`;
}

export function generateApiKey(prefix: string = 'pk'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';
  for (let i = 0; i < 32; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${randomPart}`;
}
