import type { EnergyLevel, FocusLevel } from '@/src/features/recommendations/types';

export interface FormOption {
  label: string;
  value: string;
}

interface MappingDefinition {
  tags: string[];
  genreHints?: string[];
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  tone?: string;
}

export const ACTIVITY_OPTIONS: FormOption[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'reading', label: 'Reading' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'thinking', label: 'Thinking' },
  { value: 'walking', label: 'Walking' },
  { value: 'late-night-work', label: 'Late-night work' },
];

export const MOOD_OPTIONS: FormOption[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'dreamy', label: 'Dreamy' },
  { value: 'focused', label: 'Focused' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'melancholic', label: 'Melancholic' },
  { value: 'warm', label: 'Warm' },
];

export const COLOR_OPTIONS: FormOption[] = [
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gold', label: 'Gold' },
  { value: 'green', label: 'Green' },
];

export const COUNTRY_OPTIONS: FormOption[] = [
  { value: 'france', label: 'France' },
  { value: 'japan', label: 'Japan' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'united-states', label: 'United States' },
  { value: 'united-kingdom', label: 'United Kingdom' },
  { value: 'iceland', label: 'Iceland' },
];

export const GENRE_OPTIONS: FormOption[] = [
  { value: 'ambient', label: 'Ambient' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'indie', label: 'Indie' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'folk', label: 'Folk' },
  { value: 'classical', label: 'Classical' },
];

export const LYRICAL_THEME_OPTIONS: FormOption[] = [
  { value: 'love', label: 'Love' },
  { value: 'solitude', label: 'Solitude' },
  { value: 'memory', label: 'Memory' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'longing', label: 'Longing' },
  { value: 'escape', label: 'Escape' },
];

export const ACTIVITY_MAPPINGS: Record<string, MappingDefinition> = {
  coding: {
    tags: ['focus', 'instrumental', 'steady', 'clear'],
    genreHints: ['ambient', 'electronic'],
    energyLevel: 'medium',
    focusLevel: 'focus',
    tone: 'precise',
  },
  reading: {
    tags: ['quiet', 'soft', 'nocturnal', 'acoustic'],
    genreHints: ['classical', 'folk'],
    energyLevel: 'low',
    focusLevel: 'focus',
    tone: 'quiet',
  },
  cooking: {
    tags: ['warm', 'lively', 'groove', 'sunlit'],
    genreHints: ['jazz', 'folk'],
    energyLevel: 'medium',
    focusLevel: 'balanced',
    tone: 'warm',
  },
  thinking: {
    tags: ['reflective', 'spacious', 'slow-burn', 'curious'],
    genreHints: ['ambient', 'classical'],
    energyLevel: 'low',
    focusLevel: 'balanced',
    tone: 'reflective',
  },
  walking: {
    tags: ['steady-tempo', 'drift', 'open-air', 'motion'],
    genreHints: ['indie', 'electronic'],
    energyLevel: 'medium',
    focusLevel: 'balanced',
    tone: 'open',
  },
  'late-night-work': {
    tags: ['nocturnal', 'blue-hour', 'focused', 'after-hours'],
    genreHints: ['ambient', 'jazz'],
    energyLevel: 'low',
    focusLevel: 'focus',
    tone: 'nocturnal',
  },
};

export const MOOD_MAPPINGS: Record<string, MappingDefinition> = {
  calm: {
    tags: ['calm', 'soft', 'breathing-room'],
    energyLevel: 'low',
    tone: 'quiet',
  },
  dreamy: {
    tags: ['dreamy', 'floating', 'blurred-edges'],
    energyLevel: 'low',
    tone: 'dreamy',
  },
  focused: {
    tags: ['focused', 'clean-lines', 'instrumental'],
    energyLevel: 'medium',
    focusLevel: 'focus',
    tone: 'precise',
  },
  energetic: {
    tags: ['energetic', 'bright', 'kinetic'],
    energyLevel: 'high',
    tone: 'electric',
  },
  melancholic: {
    tags: ['melancholic', 'tender', 'blue-hour'],
    energyLevel: 'low',
    tone: 'reflective',
  },
  warm: {
    tags: ['warm', 'glow', 'human'],
    energyLevel: 'medium',
    tone: 'warm',
  },
};

export const COLOR_MAPPINGS: Record<string, MappingDefinition> = {
  blue: { tags: ['blue', 'cool', 'night', 'oceanic'], tone: 'nocturnal' },
  red: { tags: ['red', 'pulse', 'heat', 'vivid'], tone: 'electric' },
  black: { tags: ['black', 'shadow', 'minimal', 'late'], tone: 'quiet' },
  white: { tags: ['white', 'air', 'clear', 'light'], tone: 'open' },
  gold: { tags: ['gold', 'warmth', 'glow', 'sunlit'], tone: 'warm' },
  green: { tags: ['green', 'earth', 'fresh', 'wandering'], tone: 'open' },
};

export const THEME_MAPPINGS: Record<string, MappingDefinition> = {
  love: { tags: ['love', 'intimacy', 'heart'] },
  solitude: { tags: ['solitude', 'alone', 'interior'] },
  memory: { tags: ['memory', 'nostalgia', 'photographs'] },
  adventure: { tags: ['adventure', 'journey', 'wide-screen'] },
  longing: { tags: ['longing', 'distance', 'yearning'] },
  escape: { tags: ['escape', 'drift', 'elsewhere'] },
};

export const GENRE_ADJACENCY: Record<string, string[]> = {
  ambient: ['electronic', 'classical'],
  jazz: ['folk', 'indie'],
  indie: ['folk', 'electronic'],
  electronic: ['ambient', 'indie'],
  folk: ['indie', 'jazz'],
  classical: ['ambient', 'folk'],
};
