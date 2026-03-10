import { env, hasLlmConfig } from '@/src/lib/env';

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export const generateTextCompletion = async (
  prompt: string,
): Promise<string | null> => {
  if (!hasLlmConfig()) {
    return null;
  }

  const response = await fetch(`${env.openAiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.openAiModel,
      messages: [
        {
          role: 'system',
          content:
            'You write subtle, compact serendipity lines for music recommendation cards.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 48,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  return payload.choices?.[0]?.message?.content?.trim() ?? null;
};
