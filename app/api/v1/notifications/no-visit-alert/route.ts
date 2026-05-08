import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { sendReminderEmail } from '@/lib/email/sendEmail';

// Vercel Cron - called weekly
export async function GET(request: NextRequest) {
  try {
    // Verify Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return errorResponse('Unauthorized', 401);
    }

    const daysThreshold = parseInt(request.nextUrl.searchParams.get('days') || '30');
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    // TODO: Find piscines without recent passages
    // const poolsWithoutVisits = await prisma.piscine.findMany({
    //   where: {
    //     passages: {
    //       none: {
    //         dateDebut: { gte: thresholdDate }
    //       }
    //     }
    //   },
    //   include: { proprietaire: true }
    // });

    let notificationCount = 0;

    // for (const pool of poolsWithoutVisits) {
    //   await sendReminderEmail(
    //     pool.proprietaire.email,
    //     pool.nom,
    //     daysThreshold
    //   );
    //   notificationCount++;
    // }

    return successResponse({
      notificationsSent: notificationCount,
      daysThreshold,
    });
  } catch (error) {
    console.error('No-visit alert error:', error);
    return errorResponse('Internal server error', 500);
  }
}
