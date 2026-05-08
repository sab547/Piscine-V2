import { NextRequest } from 'next/server';
import { devisCreateSchema } from '@/lib/api/validation';
import { successResponse, errorResponse } from '@/lib/api/response';
import { generateDevisPDFDocument } from '@/lib/pdf/generatePdfService';
import { sendDevisEmail } from '@/lib/email/sendEmail';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validated = devisCreateSchema.parse(body);

    const devisNumero = `DEV-${new Date().getFullYear()}-${Math.random().toString().slice(2, 6)}`;
    const montantTTC = validated.montantHT * (1 + (validated.tva || 20) / 100);

    // TODO: Create in Prisma
    // const devis = await prisma.devis.create({
    //   data: {
    //     tenantId,
    //     numero: devisNumero,
    //     proprietaireEmail: validated.proprietaireEmail,
    //     montantHT: new Decimal(validated.montantHT),
    //     montantTTC: new Decimal(montantTTC),
    //     tva: validated.tva || 20,
    //     description: validated.description || '',
    //     validJusqu: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    //     statut: 'BROUILLON'
    //   }
    // });

    // Generate PDF
    const pdfDoc = await generateDevisPDFDocument(
      devisNumero,
      'Client Name',
      validated.proprietaireEmail,
      validated.montantHT,
      validated.tva || 20,
      validated.description || 'Travaux d\'entretien'
    );

    // TODO: Upload PDF to Supabase Storage
    // const pdfUrl = await uploadPdfToSupabase(pdfDoc);

    const pdfUrl = `https://storage.supabase.co/piscine-v2/devis/${devisNumero}.pdf`;

    // TODO: Update devis with pdfUrl and send email
    // Send email to client
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/portail/devis/${devisNumero}`;
    await sendDevisEmail(validated.proprietaireEmail, devisNumero, montantTTC, magicLink);

    return successResponse({
      id: 'devis_id',
      numero: devisNumero,
      pdfUrl,
      statut: 'BROUILLON',
      montantHT: validated.montantHT,
      montantTTC,
    }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
