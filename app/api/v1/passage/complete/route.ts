import { NextRequest } from 'next/server';
import { passageCompleteSchema } from '@/lib/api/validation';
import { generateMagicLink } from '@/lib/auth/generateMagicLink';
import { sendRapportEmail } from '@/lib/email/sendEmail';
import { successResponse, errorResponse } from '@/lib/api/response';
import { renderToStream } from '@react-pdf/renderer';
import { generateRapportPDFDocument } from '@/lib/pdf/generatePdfService';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validated = passageCompleteSchema.parse(body);

    // TODO: Fetch passage and related data from Prisma
    // const passage = await prisma.passage.findUnique({
    //   where: { id: validated.passageId },
    //   include: { piscine: true, technicien: true }
    // });

    // Mock data for now
    const mockPassage = {
      id: validated.passageId,
      piscine: { nom: 'Villa Martinez', adresse: '12 Bd de la Mer, Cannes' },
      technicien: { nom: 'Benali', prenom: 'Karim' },
      proprietaire: { email: 'client@example.com' },
    };

    // Generate PDF
    const pdfDoc = await generateRapportPDFDocument(
      mockPassage.piscine.nom,
      mockPassage.piscine.adresse,
      `${mockPassage.technicien.prenom} ${mockPassage.technicien.nom}`,
      validated.photoBefore,
      validated.photoAfter,
      validated.ph,
      validated.chlore,
      validated.temperature
    );

    // TODO: Upload PDF to Supabase Storage and get URL
    // const pdfUrl = await uploadPdfToSupabase(pdfDoc);

    const pdfUrl = `https://storage.supabase.co/piscine-v2/pdfs/${validated.passageId}.pdf`;

    // TODO: Update passage in Prisma
    // await prisma.passage.update({
    //   where: { id: validated.passageId },
    //   data: {
    //     statut: 'COMPLETE',
    //     ph: validated.ph,
    //     chlore: validated.chlore,
    //     temperature: validated.temperature,
    //     note: validated.note,
    //     pdfUrl,
    //     emailEnvoye: false,
    //     dateFin: new Date(),
    //   }
    // });

    // Generate magic link and send email
    const magicLink = generateMagicLink(validated.passageId, 'proprietaire_id');
    await sendRapportEmail(
      mockPassage.proprietaire.email,
      mockPassage.piscine.nom,
      magicLink,
      `${mockPassage.technicien.prenom} ${mockPassage.technicien.nom}`
    );

    // TODO: Update emailEnvoye flag
    // await prisma.passage.update({
    //   where: { id: validated.passageId },
    //   data: { emailEnvoye: true }
    // });

    return successResponse({
      passageId: validated.passageId,
      pdfUrl,
      magicLink,
      emailSent: true,
    }, 201);
  } catch (error: any) {
    console.error('Passage completion error:', error);
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
