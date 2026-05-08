import { NextRequest } from 'next/server';
import { tenantProfileSchema } from '@/lib/api/validation';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    // TODO: Fetch from Prisma
    // const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

    return successResponse({
      id: tenantId,
      siret: '12345678901234',
      phone: '+33 6 12 34 56 78',
      supportEmail: 'support@example.com',
    });
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
    const validated = tenantProfileSchema.parse(body);

    // TODO: Update in Prisma
    // const updated = await prisma.tenant.update({
    //   where: { id: tenantId },
    //   data: validated,
    // });

    return successResponse({ id: tenantId, ...validated });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
