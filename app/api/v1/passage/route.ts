import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // TODO: Decode token to get tenantId
    // TODO: Fetch from Prisma:
    // const passages = await prisma.passage.findMany({
    //   where: { tenantId },
    //   include: { piscine: true, user: true },
    //   orderBy: { createdAt: 'desc' },
    // });

    // Mock response for development
    const mockPassages = [
      {
        id: '1',
        piscineNom: 'Piscine Municipale',
        technicienName: 'Pierre Martin',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ph: 7.2,
        chlore: 1.5,
        temperature: 26,
      },
      {
        id: '2',
        piscineNom: 'Piscine Privée Dupont',
        technicienName: 'Marie Laurent',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        ph: 7.4,
        chlore: 2.0,
        temperature: 27,
      },
    ];

    return NextResponse.json(mockPassages);
  } catch (error) {
    console.error('Error fetching passages:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des interventions' },
      { status: 500 }
    );
  }
}
