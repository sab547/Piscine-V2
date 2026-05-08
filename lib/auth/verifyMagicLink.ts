import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface MagicLinkPayload {
  passageId: string;
  proprietaireId: string;
  type: 'magic_link';
  iat: number;
  exp: number;
}

export function verifyMagicLink(token: string): MagicLinkPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as MagicLinkPayload;
    if (payload.type !== 'magic_link') {
      return null;
    }
    return payload;
  } catch (error) {
    console.error('Magic link verification failed:', error);
    return null;
  }
}

export function getTokenExpiry(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return null;
    }
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}
