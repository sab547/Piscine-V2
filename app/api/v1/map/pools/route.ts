import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { geocodeAddress } from '@/lib/map/geocodeService';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    // TODO: Fetch piscines for tenant from Prisma
    // const piscines = await prisma.piscine.findMany({
    //   where: { tenantId },
    //   include: { passages: { orderBy: { createdAt: 'desc' }, take: 1 } }
    // });

    // Mock data
    const pools = [
      {
        id: 'pool_001',
        nom: 'Villa Martinez',
        latitude: 43.5528,
        longitude: 7.0174,
        lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'recent', // recent | warning | alert
      },
      {
        id: 'pool_002',
        nom: 'Résidence Les Pins',
        latitude: 43.6108,
        longitude: 7.2104,
        lastVisit: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        status: 'warning',
      },
    ];

    return successResponse({
      pools,
      center: { latitude: 43.5828, longitude: 7.1147 }, // Côte d'Azur center
      zoom: 9,
    });
  } catch (error) {
    console.error('Map pools error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    const { address, city, postalCode, piscineId } = await request.json();

    // Geocode address
    const coords = await geocodeAddress(address, city, postalCode);
    if (!coords) {
      return errorResponse('Could not geocode address', 400);
    }

    // TODO: Update piscine in Prisma
    // await prisma.piscine.update({
    //   where: { id: piscineId },
    //   data: { latitude: coords.latitude, longitude: coords.longitude }
    // });

    return successResponse({
      piscineId,
      ...coords,
    });
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}
