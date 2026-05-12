/**
 * Environment variable validation.
 * Fails hard in production if required vars are missing.
 */

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value) return value;

  // During `next build`, Next.js collects page data with NODE_ENV=production
  // but env vars from the runtime environment are not available yet.
  // Only throw at actual server runtime, not during the build phase.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
    throw new Error(
      `[Security] Missing required environment variable: ${key}. ` +
      `The application cannot start without it.`
    );
  }

  if (fallback !== undefined) {
    if (!isBuildPhase) {
      console.warn(
        `[Security Warning] ${key} is not set. Using insecure default for development only. ` +
        `Set this variable before deploying to production.`
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
