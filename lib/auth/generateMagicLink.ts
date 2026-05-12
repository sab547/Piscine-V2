import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { env } from '@/lib/env';

const MAGIC_LINK_EXPIRY_SECONDS = 15 * 60; // 15 minutes

export function generateMagicLink(passageId: string, proprietaireId: string): string {
  const token = jwt.sign(
    { passageId, proprietaireId, type: 'magic_link', jti: randomBytes(16).toString('hex') },
    env.JWT_SECRET,
    { expiresIn: MAGIC_LINK_EXPIRY_SECONDS }
  );

  return `${env.NEXT_PUBLIC_APP_URL}/portail/verify?token=${token}`;
}

/**
 * Generate a cryptographically secure API key.
 */
export function generateApiKey(prefix = 'pk'): string {
  return `${prefix}_${randomBytes(32).toString('hex')}`;
}
