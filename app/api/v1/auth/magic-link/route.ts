import { NextRequest } from 'next/server';
import { generateMagicLink } from '@/lib/auth/generateMagicLink';
import { sendRapportEmail } from '@/lib/email/sendEmail';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passageId, proprietaireId, proprietaireEmail, piscineNom, technicienName } = body;

    if (!passageId || !proprietaireId || !proprietaireEmail) {
      return errorResponse('Missing required fields', 400);
    }

    const magicLink = generateMagicLink(passageId, proprietaireId);

    const emailResult = await sendRapportEmail(
      proprietaireEmail,
      piscineNom || 'votre piscine',
      magicLink,
      technicienName || 'Votre technicien'
    );

    if (!emailResult.success) {
      return errorResponse('Failed to send email', 500);
    }

    return successResponse({ magicLink, emailSent: true }, 201);
  } catch (error) {
    console.error('Magic link generation error:', error);
    return errorResponse('Internal server error', 500);
  }
}
