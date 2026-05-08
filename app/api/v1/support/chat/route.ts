import { NextRequest } from 'next/server';
import { chatMessageSchema } from '@/lib/api/validation';
import { chatWithBot } from '@/lib/chat/chatbotService';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const validated = chatMessageSchema.parse(body);

    // TODO: Fetch conversation history from Prisma
    // const session = await prisma.chatSession.findUnique({
    //   where: { id: validated.sessionId },
    //   include: { messages: { orderBy: { createdAt: 'asc' } } }
    // });

    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    // Get AI response
    const aiResult = await chatWithBot(
      validated.message,
      validated.context || 'client',
      conversationHistory
    );

    if (!aiResult.success) {
      return errorResponse(aiResult.error || 'Chatbot error', 500);
    }

    // TODO: Save user message and assistant response to Prisma
    // await Promise.all([
    //   prisma.chatMessage.create({
    //     data: { sessionId: validated.sessionId, role: 'user', content: validated.message }
    //   }),
    //   prisma.chatMessage.create({
    //     data: { sessionId: validated.sessionId, role: 'assistant', content: aiResult.response }
    //   })
    // ]);

    return successResponse({
      sessionId: validated.sessionId,
      userMessage: validated.message,
      assistantMessage: aiResult.response,
      context: validated.context || 'client',
    }, 201);
  } catch (error: any) {
    console.error('Chat error:', error);
    if (error.name === 'ZodError') {
      return errorResponse('Validation error', 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
