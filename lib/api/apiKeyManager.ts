import bcryptjs from 'bcryptjs';
import { generateApiKey } from '@/lib/auth/generateMagicLink';

export async function hashApiKey(key: string): Promise<string> {
  return bcryptjs.hash(key, 10);
}

export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(key, hash);
}

export function generateTemporaryApiKey(tenantId: string, expirationDays: number = 30) {
  const key = generateApiKey('sk');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  return {
    key, // Only shown once
    expiresAt,
  };
}
