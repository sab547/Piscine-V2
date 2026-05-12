import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';
import { successResponse, errorResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    let decoded: any;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
      if (!decoded.admin) {
        return errorResponse('Forbidden', 403);
      }
    } catch {
      return errorResponse('Invalid token', 401);
    }

    // TODO: Gather cache metrics
    // const stats = {
    //   tenants: await prisma.tenant.count(),
    //   users: await prisma.user.count(),
    //   passages: await prisma.passage.count(),
    //   piscines: await prisma.piscine.count(),
    //   devis: await prisma.devis.count(),
    // };

    const stats = {
      tenants: 12,
      users: 45,
      passages: 234,
      piscines: 56,
      devis: 18,
      activeSessions: 23,
      dbSize: '142 MB',
      cacheHitRate: '89%',
      uptime: '99.98%',
    };

    return successResponse({
      stats,
      lastUpdated: new Date(),
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Admin cache error:', error);
    return errorResponse('Internal server error', 500);
  }
}
