import type { UiLanguage } from '@/src/i18n/types';
import type { EnergyLevel, FocusLevel, RecommendationField } from '@/src/features/recommendations/types';
import type { LocalizedText } from '@/src/i18n/types';

export interface FormOption {
  labels: LocalizedText;
  value: string;
}

interface MappingDefinition {
  energyLevel?: EnergyLevel;
  focusLevel?: FocusLevel;
  genreHints?: string[];
  tags: string[];
  tone?: string;
}

const text = (en: string, zh: string): LocalizedText => ({ en, zh });

export const localizeText = (value: LocalizedText, language: UiLanguage): string => {
  return value[language];
};

export const localizeOptions = (
  options: FormOption[],
  language: UiLanguage,
): Array<{ label: string; value: string }> => {
  return options.map((option) => ({
    label: option.labels[language],
    value: option.value,
  }));
};

export const getOptionLabel = (
  options: FormOption[],
  value: string,
  language: UiLanguage,
): string => {
  return options.find((option) => option.value === value)?.labels[language] ?? value;
};

export const ACTIVITY_OPTIONS: FormOption[] = [
  { value: 'coding', labels: text('Coding', '编程') },
  { value: 'reading', labels: text('Reading', '阅读') },
  { value: 'cooking', labels: text('Cooking', '做饭') },
  { value: 'thinking', labels: text('Thinking', '思考') },
  { value: 'walking', labels: text('Walking', '散步') },
  { value: 'late-night-work', labels: text('Late-night work', '深夜工作') },
  { value: 'writing', labels: text('Writing', '写作') },
  { value: 'commuting', labels: text('Commuting', '通勤') },
];

export const MOOD_OPTIONS: FormOption[] = [
  { value: 'calm', labels: text('Calm', '平静') },
  { value: 'dreamy', labels: text('Dreamy', '梦幻') },
  { value: 'focused', labels: text('Focused', '专注') },
  { value: 'energetic', labels: text('Energetic', '有能量') },
  { value: 'melancholic', labels: text('Melancholic', '忧郁') },
  { value: 'warm', labels: text('Warm', '温暖') },
  { value: 'nostalgic', labels: text('Nostalgic', '怀旧') },
  { value: 'intimate', labels: text('Intimate', '亲密') },
  { value: 'cinematic', labels: text('Cinematic', '电影感') },
  { value: 'reflective', labels: text('Reflective', '沉思') },
  { value: 'euphoric', labels: text('Euphoric', '亢奋') },
  { value: 'restless', labels: text('Restless', '躁动') },
  { value: 'bittersweet', labels: text('Bittersweet', '苦甜交织') },
  { value: 'nocturnal', labels: text('Nocturnal', '夜色') },
  { value: 'tender', labels: text('Tender', '柔软') },
  { value: 'weightless', labels: text('Weightless', '轻盈') },
  { value: 'hopeful', labels: text('Hopeful', '有希望') },
];

export const COLOR_OPTIONS: FormOption[] = [
  { value: 'blue', labels: text('Blue', '蓝') },
  { value: 'red', labels: text('Red', '红') },
  { value: 'black', labels: text('Black', '黑') },
  { value: 'white', labels: text('White', '白') },
  { value: 'gold', labels: text('Gold', '金') },
  { value: 'green', labels: text('Green', '绿') },
];

export const COUNTRY_OPTIONS: FormOption[] = [
  { value: 'china', labels: text('China', '中国') },
  { value: 'korea', labels: text('Korea', '韩国') },
  { value: 'japan', labels: text('Japan', '日本') },
  { value: 'russia', labels: text('Russia', '俄罗斯') },
  { value: 'united-kingdom', labels: text('United Kingdom', '英国') },
  { value: 'united-states', labels: text('United States', '美国') },
  { value: 'france', labels: text('France', '法国') },
  { value: 'germany', labels: text('Germany', '德国') },
  { value: 'brazil', labels: text('Brazil', '巴西') },
  { value: 'india', labels: text('India', '印度') },
  { value: 'middle-east', labels: text('Middle East', '中东') },
  { value: 'nordic', labels: text('Nordic', '北欧') },
  { value: 'latin', labels: text('Latin', '拉丁') },
  { value: 'african', labels: text('African', '非洲') },
];

export const GENRE_OPTIONS: FormOption[] = [
  { value: 'pop', labels: text('Pop', '流行') },
  { value: 'rock', labels: text('Rock', '摇滚') },
  { value: 'hip-hop', labels: text('Hip-hop', '嘻哈') },
  { value: 'ambient', labels: text('Ambient', '氛围') },
  { value: 'jazz', labels: text('Jazz', '爵士') },
  { value: 'r-and-b', labels: text('R&B', 'R&B') },
  { value: 'city-pop', labels: text('City pop', 'City pop') },
  { value: 'shoegaze', labels: text('Shoegaze', '自赏') },
  { value: 'indie', labels: text('Indie', '独立') },
  { value: 'electronic', labels: text('Electronic', '电子') },
  { value: 'folk', labels: text('Folk', '民谣') },
  { value: 'lo-fi', labels: text('Lo-fi', 'Lo-fi') },
  { value: 'synthwave', labels: text('Synthwave', '合成器浪潮') },
  { value: 'house', labels: text('House', 'House') },
  { value: 'techno', labels: text('Techno', 'Techno') },
  { value: 'post-rock', labels: text('Post-rock', '后摇') },
  { value: 'orchestral', labels: text('Orchestral', '管弦') },
  { value: 'trap', labels: text('Trap', 'Trap') },
  { value: 'funk', labels: text('Funk', 'Funk') },
  { value: 'soul', labels: text('Soul', 'Soul') },
  { value: 'classical', labels: text('Classical', '古典') },
];

export const LYRICAL_THEME_OPTIONS: FormOption[] = [
  { value: 'love', labels: text('Love', '爱') },
  { value: 'solitude', labels: text('Solitude', '独处') },
  { value: 'memory', labels: text('Memory', '记忆') },
  { value: 'adventure', labels: text('Adventure', '冒险') },
  { value: 'longing', labels: text('Longing', '想念') },
  { value: 'escape', labels: text('Escape', '逃离') },
  { value: 'healing', labels: text('Healing', '疗愈') },
  { value: 'heartbreak', labels: text('Heartbreak', '心碎') },
];

export const SCENE_OPTIONS: FormOption[] = [
  { value: 'study', labels: text('Study', '学习') },
  { value: 'driving', labels: text('Driving', '开车') },
  { value: 'late-night', labels: text('Late night', '深夜') },
  { value: 'rainy-day', labels: text('Rainy day', '雨天') },
  { value: 'gym', labels: text('Gym', '健身') },
  { value: 'sunset', labels: text('Sunset', '日落') },
  { value: 'heartbreak', labels: text('Heartbreak', '失恋') },
  { value: 'healing', labels: text('Healing', '疗愈') },
];

export const FIELD_OPTION_MAP: Record<
  Exclude<RecommendationField, 'uiLanguage' | 'surprise' | 'rerollSeed' | 'excludeIds'>,
  FormOption[]
> = {
  activity: ACTIVITY_OPTIONS,
  color: COLOR_OPTIONS,
  country: COUNTRY_OPTIONS,
  genre: GENRE_OPTIONS,
  lyricalTheme: LYRICAL_THEME_OPTIONS,
  mood: MOOD_OPTIONS,
  scene: SCENE_OPTIONS,
};

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
  calm: { tags: ['calm', 'soft', 'breathing-room'], energyLevel: 'low', tone: 'quiet' },
  dreamy: { tags: ['dreamy', 'floating', 'blurred-edges'], energyLevel: 'low', tone: 'dreamy' },
  focused: {
    tags: ['focused', 'clean-lines', 'instrumental'],
    energyLevel: 'medium',
    focusLevel: 'focus',
    tone: 'precise',
  },
  energetic: { tags: ['energetic', 'bright', 'kinetic'], energyLevel: 'high', tone: 'electric' },
  melancholic: {
    tags: ['melancholic', 'tender', 'blue-hour'],
    energyLevel: 'low',
    tone: 'reflective',
  },
  warm: { tags: ['warm', 'glow', 'human'], energyLevel: 'medium', tone: 'warm' },
  nostalgic: { tags: ['nostalgic', 'faded', 'remembered'], energyLevel: 'low', tone: 'reflective' },
  intimate: { tags: ['intimate', 'close', 'small-room'], energyLevel: 'low', tone: 'tender' },
  cinematic: { tags: ['cinematic', 'wide-screen', 'dramatic'], energyLevel: 'medium', tone: 'open' },
  reflective: { tags: ['reflective', 'interior', 'slow-burn'], energyLevel: 'low', tone: 'reflective' },
  euphoric: { tags: ['euphoric', 'lift', 'radiant'], energyLevel: 'high', tone: 'electric' },
  restless: { tags: ['restless', 'uneasy', 'moving'], energyLevel: 'medium', tone: 'electric' },
  bittersweet: { tags: ['bittersweet', 'tender', 'afterglow'], energyLevel: 'low', tone: 'reflective' },
  nocturnal: { tags: ['nocturnal', 'after-hours', 'blue-hour'], energyLevel: 'low', tone: 'nocturnal' },
  tender: { tags: ['tender', 'soft', 'close'], energyLevel: 'low', tone: 'tender' },
  weightless: { tags: ['weightless', 'floating', 'air'], energyLevel: 'low', tone: 'dreamy' },
  hopeful: { tags: ['hopeful', 'rising', 'light-returning'], energyLevel: 'medium', tone: 'open' },
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
