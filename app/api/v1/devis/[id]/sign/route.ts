import { NextRequest } from 'next/server';
import { devisSignSchema } from '@/lib/api/validation';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validated = devisSignSchema.parse(body);

    // TODO: Update devis in Prisma
    // const updated = await prisma.devis.update({
    //   where: { id: params.id },
    //   data: {
    //     statut: 'ACCEPTE',
    //     signatureDataUrl: validated.signature,
    //     signeA: new Date(),
    //     signeNom: validated.signerName
    //   }
    // });

    return successResponse({
      id: params.id,
      statut: 'ACCEPTE',
      signedAt: new Date(),
      signerName: validated.signerName,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
