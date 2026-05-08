import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { sendReminderEmail } from '@/lib/email/sendEmail';

// Vercel Cron - called every day
export async function GET(request: NextRequest) {
  try {
    // Verify this is called by Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return errorResponse('Unauthorized', 401);
    }

    // TODO: Fetch all reminders where nextDueAt <= now
    // const dueReminders = await prisma.recurringReminder.findMany({
    //   where: {
    //     nextDueAt: { lte: new Date() },
    //     enabled: true
    //   },
    //   include: { piscine: { include: { proprietaire: true } } }
    // });

    // Mock: Process reminders
    let processedCount = 0;

    // for (const reminder of dueReminders) {
    //   const nextDueAt = new Date();
    //   nextDueAt.setDate(nextDueAt.getDate() + reminder.frequencyDays);

    //   // Send email to proprietaire
    //   await sendReminderEmail(
    //     reminder.piscine.proprietaire.email,
    //     reminder.piscine.nom,
    //     reminder.frequencyDays
    //   );

    //   // Update reminder
    //   await prisma.recurringReminder.update({
    //     where: { id: reminder.id },
    //     data: { lastSentAt: new Date(), nextDueAt }
    //   });

    //   processedCount++;
    // }

    return successResponse({ remindersProcessed: processedCount });
  } catch (error) {
    console.error('Reminder processing error:', error);
    return errorResponse('Internal server error', 500);
  }
}
