import {
  ACTIVITY_OPTIONS,
  COLOR_OPTIONS,
  COUNTRY_OPTIONS,
  GENRE_OPTIONS,
  LYRICAL_THEME_OPTIONS,
  MOOD_OPTIONS,
  SCENE_OPTIONS,
} from '@/src/config/mappings';
import { Button } from '@/src/components/ui/button';
import { OptionChipField } from '@/src/components/ui/option-chip-field';
import {
  PresetStrip,
  type RecommendationPreset,
} from '@/src/features/recommendations/components/preset-strip';
import { SignalSummary } from '@/src/features/recommendations/components/signal-summary';

import type { RecommendationAction } from '@/src/features/recommendations/experience-types';
import type { RecommendationInput } from '@/src/features/recommendations/types';

interface ContextFormProps {
  activeAction: RecommendationAction | null;
  canGenerate: boolean;
  canReroll: boolean;
  isLoading: boolean;
  onApplyPreset: (preset: RecommendationPreset) => void;
  values: RecommendationInput;
  onChange: (field: keyof RecommendationInput, value: string) => void;
  onGenerate: () => void;
  onReroll: () => void;
  onSpark: () => void;
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
  canGenerate,
  canReroll,
  isLoading,
  onApplyPreset,
  values,
  onChange,
  onGenerate,
  onReroll,
  onSpark,
  onSurprise,
}: ContextFormProps) {
  return (
    <section className="heroPanel">
      <div className="heroCopy">
        <div className="heroLabelRow">
          <span className="heroLabelDot" aria-hidden="true" />
          <p className="heroLabel">Contextual music muse</p>
        </div>
        <h1 className="heroTitle">
          <span className="heroTitleLine">Describe the room, the hour,</span>
          <span className="heroTitleLine heroTitleLineSoft">and the color around you.</span>
        </h1>
        <p className="heroText">
          A few human signals become three songs, one poetic line, and a small
          detour that still holds together.
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
          <OptionChipField
            hint="The verb"
            index="01"
            label="Activity"
            options={ACTIVITY_OPTIONS}
            value={values.activity ?? ''}
            onChange={(value) => onChange('activity', value)}
          />
          <OptionChipField
            hint="The weather"
            index="02"
            label="Mood"
            options={MOOD_OPTIONS}
            value={values.mood ?? ''}
            onChange={(value) => onChange('mood', value)}
          />
          <OptionChipField
            hint="The tint"
            index="03"
            label="Color"
            options={COLOR_OPTIONS}
            value={values.color ?? ''}
            onChange={(value) => onChange('color', value)}
          />
          <OptionChipField
            hint="The region"
            index="04"
            label="Region / culture"
            options={COUNTRY_OPTIONS}
            value={values.country ?? ''}
            onChange={(value) => onChange('country', value)}
          />
          <OptionChipField
            hint="The frame"
            index="05"
            label="Genre"
            options={GENRE_OPTIONS}
            value={values.genre ?? ''}
            onChange={(value) => onChange('genre', value)}
          />
          <OptionChipField
            hint="The setting"
            index="06"
            label="Scene"
            options={SCENE_OPTIONS}
            value={values.scene ?? ''}
            onChange={(value) => onChange('scene', value)}
          />
          <OptionChipField
            hint="The echo"
            index="07"
            label="Theme"
            options={LYRICAL_THEME_OPTIONS}
            value={values.lyricalTheme ?? ''}
            onChange={(value) => onChange('lyricalTheme', value)}
          />
        </div>

        <div className="actionsRow">
          <Button disabled={!canGenerate || isLoading} onClick={onGenerate} type="button">
            {activeAction === 'generate' ? 'Composing...' : 'Generate'}
          </Button>
          <Button disabled={isLoading} onClick={onSpark} type="button" variant="secondary">
            Spark
          </Button>
          <Button
            disabled={!canGenerate || isLoading}
            onClick={onSurprise}
            type="button"
            variant="secondary"
          >
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
          One to four signals usually works best. Spark can seed a coherent set when you
          want a fast starting point without filling every category.
        </p>
      </div>
    </section>
  );
}
