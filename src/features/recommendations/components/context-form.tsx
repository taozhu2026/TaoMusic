import {
  ACTIVITY_OPTIONS,
  COLOR_OPTIONS,
  COUNTRY_OPTIONS,
  GENRE_OPTIONS,
  LYRICAL_THEME_OPTIONS,
  MOOD_OPTIONS,
} from '@/src/config/mappings';
import { Button } from '@/src/components/ui/button';
import { SelectField } from '@/src/components/ui/select-field';
import {
  PresetStrip,
  type RecommendationPreset,
} from '@/src/features/recommendations/components/preset-strip';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { RecommendationInput } from '@/src/features/recommendations/types';

export type RecommendationAction = 'generate' | 'reroll' | 'surprise';

interface ContextFormProps {
  activeAction: RecommendationAction | null;
  canReroll: boolean;
  isLoading: boolean;
  onApplyPreset: (preset: RecommendationPreset) => void;
  values: RecommendationInput;
  onChange: (field: keyof RecommendationInput, value: string) => void;
  onGenerate: () => void;
  onReroll: () => void;
  onSurprise: () => void;
}

const PRESETS: RecommendationPreset[] = [
  {
    id: 'midnight-margins',
    label: 'Midnight Margins',
    note: 'late-night work, blue, France, calm',
    values: {
      activity: 'late-night-work',
      color: 'blue',
      country: 'france',
      mood: 'calm',
      genre: 'classical',
      lyricalTheme: 'memory',
    },
  },
  {
    id: 'kitchen-sunlight',
    label: 'Kitchen Sunlight',
    note: 'cooking, gold, Brazil, warm',
    values: {
      activity: 'cooking',
      color: 'gold',
      country: 'brazil',
      mood: 'warm',
      genre: 'jazz',
      lyricalTheme: 'love',
    },
  },
  {
    id: 'neon-footpath',
    label: 'Neon Footpath',
    note: 'walking, red, Japan, dreamy',
    values: {
      activity: 'walking',
      color: 'red',
      country: 'japan',
      mood: 'dreamy',
      genre: 'electronic',
      lyricalTheme: 'escape',
    },
  },
];

export function ContextForm({
  activeAction,
  canReroll,
  isLoading,
  onApplyPreset,
  values,
  onChange,
  onGenerate,
  onReroll,
  onSurprise,
}: ContextFormProps) {
  return (
    <section className="heroPanel">
      <div className="heroCopy">
        <p className="eyebrow">Contextual music muse</p>
        <h1 className="heroTitle">Describe the room, the hour, and the color around you.</h1>
        <p className="heroText">
          TaoMusic turns a few human signals into a tiny listening constellation:
          three songs, one poetic line, and just enough surprise to feel discovered.
        </p>
      </div>

      <div className="museManifesto">
        <div className="manifestoBlock">
          <p className="manifestoLabel">How it thinks</p>
          <p className="manifestoText">
            Activity anchors the search. Mood and genre tune the emotional register.
            Color bends the atmosphere. Country adds a scenic detour.
          </p>
        </div>
        <SignalSummary title="Pinned signal" values={values} />
      </div>

      <PresetStrip onSelect={onApplyPreset} presets={PRESETS} />

      <div className="formPanel">
        <div className="fieldGrid">
          <SelectField
            hint="The verb"
            index="01"
            label="Activity"
            options={ACTIVITY_OPTIONS}
            placeholder="What are you doing?"
            value={values.activity ?? ''}
            onChange={(value) => onChange('activity', value)}
          />
          <SelectField
            hint="The weather"
            index="02"
            label="Mood"
            options={MOOD_OPTIONS}
            placeholder="What is the emotional weather?"
            value={values.mood ?? ''}
            onChange={(value) => onChange('mood', value)}
          />
          <SelectField
            hint="The tint"
            index="03"
            label="Color"
            options={COLOR_OPTIONS}
            placeholder="Choose a color aura"
            value={values.color ?? ''}
            onChange={(value) => onChange('color', value)}
          />
          <SelectField
            hint="The place"
            index="04"
            label="Country"
            options={COUNTRY_OPTIONS}
            placeholder="Where should the music lean?"
            value={values.country ?? ''}
            onChange={(value) => onChange('country', value)}
          />
          <SelectField
            hint="The frame"
            index="05"
            label="Genre"
            options={GENRE_OPTIONS}
            placeholder="Pick a stylistic anchor"
            value={values.genre ?? ''}
            onChange={(value) => onChange('genre', value)}
          />
          <SelectField
            hint="The echo"
            index="06"
            label="Theme"
            options={LYRICAL_THEME_OPTIONS}
            placeholder="What should it echo?"
            value={values.lyricalTheme ?? ''}
            onChange={(value) => onChange('lyricalTheme', value)}
          />
        </div>

        <div className="actionsRow">
          <Button disabled={isLoading} onClick={onGenerate} type="button">
            {activeAction === 'generate' ? 'Composing...' : 'Generate'}
          </Button>
          <Button disabled={isLoading} onClick={onSurprise} type="button" variant="secondary">
            {activeAction === 'surprise' ? 'Detouring...' : 'Add surprise'}
          </Button>
          <Button
            disabled={!canReroll || isLoading}
            onClick={onReroll}
            type="button"
            variant="ghost"
          >
            {activeAction === 'reroll' ? 'Rerolling...' : 'Reroll'}
          </Button>
        </div>

        <p className="helperText">
          One to three signals usually works best. Narrow inputs stay coherent; looser
          inputs drift into more serendipitous territory.
        </p>
      </div>
    </section>
  );
}
