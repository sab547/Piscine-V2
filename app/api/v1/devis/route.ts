import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // TODO: Decode token to get tenantId
    // TODO: Fetch from Prisma:
    // const devis = await prisma.devis.findMany({
    //   where: { tenantId },
    //   orderBy: { createdAt: 'desc' },
    // });

    // Mock response for development
    const mockDevis = [
      {
        id: '1',
        numero: 'DEV-2026-0001',
        montantTTC: 650,
        statut: 'ACCEPTE',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        numero: 'DEV-2026-0002',
        montantTTC: 1200,
        statut: 'ENVOYE',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        numero: 'DEV-2026-0003',
        montantTTC: 450,
        statut: 'BROUILLON',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json(mockDevis);
  } catch (error) {
    console.error('Error fetching devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des devis' },
      { status: 500 }
    );
  }
}
