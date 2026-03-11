import { env, hasLlmConfig } from '@/src/lib/env';

interface ImageGenerationResponse {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
    url?: string;
  }>;
}

export interface GeneratedImageAsset {
  imageUrl: string;
  promptLabel: string;
}

export const generateImageAsset = async (
  prompt: string,
): Promise<GeneratedImageAsset | null> => {
  if (!hasLlmConfig()) {
    return null;
  }

  const response = await fetch(`${env.openAiBaseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.openAiImageModel,
      prompt,
      size: '1024x1024',
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as ImageGenerationResponse;
  const item = payload.data?.[0];

  if (!item) {
    return null;
  }

  if (item.url) {
    return {
      imageUrl: item.url,
      promptLabel: item.revised_prompt?.trim() || prompt,
    };
  }

  if (item.b64_json) {
    return {
      imageUrl: `data:image/png;base64,${item.b64_json}`,
      promptLabel: item.revised_prompt?.trim() || prompt,
    };
  }

  return null;
};
