import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const devisId = params.id;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!devisId || !token) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // TODO: Decode token and verify it's valid for this devis
    // TODO: Fetch from Prisma:
    // const devis = await prisma.devis.findUnique({
    //   where: { id: devisId },
    //   include: { piscine: true, passage: true },
    // });

    // Mock response for development
    const mockDevis = {
      id: devisId,
      numero: `DEV-2026-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
      piscineNom: 'Piscine Municipale',
      proprietaireNom: 'Jean Dupont',
      proprietaireEmail: 'jean@example.com',
      description: 'Nettoyage complet de la piscine et traitement de l\'eau',
      montantHT: 500,
      montantTVA: 100,
      montantTTC: 600,
      statut: 'ENVOYE',
      valableJusqu: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(mockDevis);
  } catch (error) {
    console.error('Error fetching devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du devis' },
      { status: 500 }
    );
  }
}
