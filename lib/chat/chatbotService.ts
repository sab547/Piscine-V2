import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPromptTech = `You are a helpful support assistant for PoolTrack, a pool maintenance management platform.
You help pool technicians with questions about:
- How to use the PoolTrack app
- Recording pool measurements (pH, chlorine, temperature)
- Uploading photos of pools
- Managing interventions
- Common pool maintenance issues and solutions

Always respond in French. Be concise and helpful. If you don't know something, direct the user to contact support.`;

const systemPromptClient = `You are a helpful support assistant for PoolTrack, a pool maintenance management platform.
You help pool owners with questions about:
- Viewing their pool maintenance reports
- Understanding water quality measurements
- Tracking pool care history
- Reviewing and signing quotes (devis)
- Common pool maintenance best practices

Always respond in French. Be concise and helpful. If you don't know something, direct the user to contact support.`;

export async function chatWithBot(
  message: string,
  context: 'tech' | 'client' = 'client',
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  try {
    const systemPrompt = context === 'tech' ? systemPromptTech : systemPromptClient;

    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ] as any,
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';

    return {
      success: true,
      response: assistantMessage,
    };
  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      success: false,
      error: 'Erreur lors du traitement de votre message. Veuillez réessayer.',
    };
  }
}
