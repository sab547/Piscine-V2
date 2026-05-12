import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

export interface MagicLinkPayload {
  passageId: string;
  proprietaireId: string;
  type: 'magic_link';
  jti: string;
  iat: number;
  exp: number;
}

export function verifyMagicLink(token: string): MagicLinkPayload | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as MagicLinkPayload;
    if (payload.type !== 'magic_link') return null;
    return payload;
  } catch {
    // Do not log token content — could expose sensitive data
    return null;
  }
}

export function getTokenExpiry(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded?.exp) return null;
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}
