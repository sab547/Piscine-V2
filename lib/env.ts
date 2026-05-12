/**
 * Environment variable validation.
 * Fails hard in production if required vars are missing.
 */

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value) return value;

  if (fallback !== undefined) {
    // Only warn outside of the Next.js build phase to keep build logs clean
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      console.error(
        `[Security] ${key} is not set. Using insecure fallback. ` +
        `Set this environment variable in production.`
      );
    }
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${key}`);
}

export const env = {
  JWT_SECRET: requireEnv('JWT_SECRET', 'dev-only-secret-change-in-production-32chars!!'),
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@pooltrack.com',
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || null,
  TECH_CODES: process.env.TECH_CODES || null,
} as const;
