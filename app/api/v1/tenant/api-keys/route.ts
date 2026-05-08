import { NextRequest } from 'next/server';
import { apiKeyCreateSchema } from '@/lib/api/validation';
import { generateTemporaryApiKey, hashApiKey } from '@/lib/api/apiKeyManager';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    // TODO: Fetch all API keys for tenant from Prisma (without hashes)
    // const keys = await prisma.apiKey.findMany({
    //   where: { tenantId },
    //   select: { id: true, name: true, expiresAt: true, lastUsedAt: true, createdAt: true }
    // });

    return successResponse([
      {
        id: 'key_1',
        name: 'Production API Key',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lastUsedAt: new Date(),
        createdAt: new Date(),
      },
    ]);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validated = apiKeyCreateSchema.parse(body);

    const { key, expiresAt } = generateTemporaryApiKey(tenantId, validated.expirationDays);
    const keyHash = await hashApiKey(key);

    // TODO: Save to Prisma
    // await prisma.apiKey.create({
    //   data: { tenantId, name: validated.name, keyHash, expiresAt }
    // });

    return successResponse({
      key, // Only shown once
      expiresAt,
      message: 'Save this key securely. It will not be shown again.',
    }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
