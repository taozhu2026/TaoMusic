export interface AppEnv {
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  openAiApiKey?: string;
  openAiModel: string;
  openAiBaseUrl: string;
}

const trimEnv = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const env: AppEnv = {
  spotifyClientId: trimEnv(process.env.SPOTIFY_CLIENT_ID),
  spotifyClientSecret: trimEnv(process.env.SPOTIFY_CLIENT_SECRET),
  openAiApiKey: trimEnv(process.env.OPENAI_API_KEY),
  openAiModel: trimEnv(process.env.OPENAI_MODEL) ?? 'gpt-4.1-mini',
  openAiBaseUrl: trimEnv(process.env.OPENAI_BASE_URL) ?? 'https://api.openai.com/v1',
};

export const hasSpotifyConfig = (): boolean =>
  Boolean(env.spotifyClientId && env.spotifyClientSecret);

export const hasLlmConfig = (): boolean => Boolean(env.openAiApiKey);
