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
  { value: 'writing', label: 'Writing' },
  { value: 'commuting', label: 'Commuting' },
];

export const MOOD_OPTIONS: FormOption[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'dreamy', label: 'Dreamy' },
  { value: 'focused', label: 'Focused' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'melancholic', label: 'Melancholic' },
  { value: 'warm', label: 'Warm' },
  { value: 'nostalgic', label: 'Nostalgic' },
  { value: 'intimate', label: 'Intimate' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'reflective', label: 'Reflective' },
  { value: 'euphoric', label: 'Euphoric' },
  { value: 'restless', label: 'Restless' },
  { value: 'bittersweet', label: 'Bittersweet' },
  { value: 'nocturnal', label: 'Nocturnal' },
  { value: 'tender', label: 'Tender' },
  { value: 'weightless', label: 'Weightless' },
  { value: 'hopeful', label: 'Hopeful' },
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
  { value: 'china', label: 'China' },
  { value: 'korea', label: 'Korea' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
  { value: 'india', label: 'India' },
  { value: 'japan', label: 'Japan' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'russia', label: 'Russia' },
  { value: 'united-states', label: 'United States' },
  { value: 'united-kingdom', label: 'United Kingdom' },
  { value: 'iceland', label: 'Iceland' },
  { value: 'middle-east', label: 'Middle East' },
  { value: 'nordic', label: 'Nordic' },
  { value: 'latin', label: 'Latin' },
  { value: 'african', label: 'African' },
];

export const GENRE_OPTIONS: FormOption[] = [
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'hip-hop', label: 'Hip-hop' },
  { value: 'ambient', label: 'Ambient' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'r-and-b', label: 'R&B' },
  { value: 'city-pop', label: 'City pop' },
  { value: 'shoegaze', label: 'Shoegaze' },
  { value: 'indie', label: 'Indie' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'folk', label: 'Folk' },
  { value: 'lo-fi', label: 'Lo-fi' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'house', label: 'House' },
  { value: 'techno', label: 'Techno' },
  { value: 'post-rock', label: 'Post-rock' },
  { value: 'orchestral', label: 'Orchestral' },
  { value: 'trap', label: 'Trap' },
  { value: 'funk', label: 'Funk' },
  { value: 'soul', label: 'Soul' },
  { value: 'classical', label: 'Classical' },
];

export const LYRICAL_THEME_OPTIONS: FormOption[] = [
  { value: 'love', label: 'Love' },
  { value: 'solitude', label: 'Solitude' },
  { value: 'memory', label: 'Memory' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'longing', label: 'Longing' },
  { value: 'escape', label: 'Escape' },
  { value: 'healing', label: 'Healing' },
  { value: 'heartbreak', label: 'Heartbreak' },
];

export const SCENE_OPTIONS: FormOption[] = [
  { value: 'study', label: 'Study' },
  { value: 'driving', label: 'Driving' },
  { value: 'late-night', label: 'Late night' },
  { value: 'rainy-day', label: 'Rainy day' },
  { value: 'gym', label: 'Gym' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'heartbreak', label: 'Heartbreak' },
  { value: 'healing', label: 'Healing' },
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
  writing: {
    tags: ['reflective', 'steady', 'literary', 'interior'],
    genreHints: ['folk', 'classical'],
    energyLevel: 'low',
    focusLevel: 'balanced',
    tone: 'reflective',
  },
  commuting: {
    tags: ['motion', 'urban', 'tempo', 'passing-lights'],
    genreHints: ['indie', 'electronic'],
    energyLevel: 'medium',
    focusLevel: 'balanced',
    tone: 'open',
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
  nostalgic: {
    tags: ['nostalgic', 'faded', 'remembered'],
    energyLevel: 'low',
    tone: 'reflective',
  },
  intimate: {
    tags: ['intimate', 'close', 'small-room'],
    energyLevel: 'low',
    tone: 'tender',
  },
  cinematic: {
    tags: ['cinematic', 'wide-screen', 'dramatic'],
    energyLevel: 'medium',
    tone: 'open',
  },
  reflective: {
    tags: ['reflective', 'interior', 'slow-burn'],
    energyLevel: 'low',
    tone: 'reflective',
  },
  euphoric: {
    tags: ['euphoric', 'lift', 'radiant'],
    energyLevel: 'high',
    tone: 'electric',
  },
  restless: {
    tags: ['restless', 'uneasy', 'moving'],
    energyLevel: 'medium',
    tone: 'electric',
  },
  bittersweet: {
    tags: ['bittersweet', 'tender', 'afterglow'],
    energyLevel: 'low',
    tone: 'reflective',
  },
  nocturnal: {
    tags: ['nocturnal', 'after-hours', 'blue-hour'],
    energyLevel: 'low',
    tone: 'nocturnal',
  },
  tender: {
    tags: ['tender', 'soft', 'close'],
    energyLevel: 'low',
    tone: 'tender',
  },
  weightless: {
    tags: ['weightless', 'floating', 'air'],
    energyLevel: 'low',
    tone: 'dreamy',
  },
  hopeful: {
    tags: ['hopeful', 'rising', 'light-returning'],
    energyLevel: 'medium',
    tone: 'open',
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
  healing: { tags: ['healing', 'repair', 'soft-return'] },
  heartbreak: { tags: ['heartbreak', 'split', 'ache'] },
};

export const SCENE_MAPPINGS: Record<string, MappingDefinition> = {
  study: {
    tags: ['study', 'focus', 'desk', 'steady'],
    genreHints: ['lo-fi', 'ambient'],
    energyLevel: 'low',
    focusLevel: 'focus',
    tone: 'precise',
  },
  driving: {
    tags: ['driving', 'motion', 'road', 'passing-lights'],
    genreHints: ['indie', 'synthwave'],
    energyLevel: 'medium',
    tone: 'open',
  },
  'late-night': {
    tags: ['late-night', 'after-hours', 'dim', 'blue-hour'],
    genreHints: ['ambient', 'jazz'],
    energyLevel: 'low',
    tone: 'nocturnal',
  },
  'rainy-day': {
    tags: ['rainy-day', 'wet', 'haze', 'soft-reflection'],
    genreHints: ['ambient', 'shoegaze'],
    energyLevel: 'low',
    tone: 'dreamy',
  },
  gym: {
    tags: ['gym', 'kinetic', 'pulse', 'push'],
    genreHints: ['house', 'hip-hop'],
    energyLevel: 'high',
    tone: 'electric',
  },
  sunset: {
    tags: ['sunset', 'afterglow', 'golden', 'wide-air'],
    genreHints: ['city-pop', 'indie'],
    energyLevel: 'medium',
    tone: 'warm',
  },
  heartbreak: {
    tags: ['heartbreak', 'ache', 'alone', 'aftermath'],
    genreHints: ['soul', 'folk'],
    energyLevel: 'low',
    tone: 'reflective',
  },
  healing: {
    tags: ['healing', 'repair', 'gentle', 'return'],
    genreHints: ['ambient', 'orchestral'],
    energyLevel: 'low',
    tone: 'hopeful',
  },
};

export const GENRE_ADJACENCY: Record<string, string[]> = {
  pop: ['city-pop', 'soul'],
  rock: ['post-rock', 'indie'],
  'hip-hop': ['trap', 'r-and-b'],
  ambient: ['electronic', 'classical'],
  jazz: ['folk', 'indie'],
  'r-and-b': ['soul', 'pop'],
  'city-pop': ['pop', 'synthwave'],
  shoegaze: ['post-rock', 'ambient'],
  indie: ['folk', 'electronic'],
  electronic: ['ambient', 'indie'],
  folk: ['indie', 'jazz'],
  'lo-fi': ['ambient', 'hip-hop'],
  synthwave: ['electronic', 'city-pop'],
  house: ['techno', 'electronic'],
  techno: ['house', 'electronic'],
  'post-rock': ['shoegaze', 'orchestral'],
  orchestral: ['classical', 'post-rock'],
  trap: ['hip-hop', 'electronic'],
  funk: ['soul', 'jazz'],
  soul: ['r-and-b', 'funk'],
  classical: ['ambient', 'folk'],
};
