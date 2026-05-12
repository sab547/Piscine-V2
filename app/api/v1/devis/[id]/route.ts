import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const devisId = params.id;

    if (!devisId || typeof devisId !== 'string') {
      return NextResponse.json({ error: 'ID de devis invalide' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    // Verify token is valid (not just present)
    let decoded: Record<string, unknown>;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    // In production: query database and verify tenant ownership
    // const devis = await prisma.devis.findUnique({ where: { id: devisId } });
    // if (!devis || devis.tenantId !== decoded.tenantId) {
    //   return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    // }

    const mockDevis = {
      id: devisId,
      numero: `DEV-2026-0001`,
      piscineNom: 'Piscine Municipale',
      proprietaireNom: 'Jean Dupont',
      proprietaireEmail: 'jean@example.com',
      description: "Nettoyage complet de la piscine et traitement de l'eau",
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
    return NextResponse.json({ error: 'Erreur lors du chargement du devis' }, { status: 500 });
  }
}
