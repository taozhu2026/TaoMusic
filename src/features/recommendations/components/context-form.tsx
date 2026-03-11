import {
  ACTIVITY_OPTIONS,
  COLOR_OPTIONS,
  COUNTRY_OPTIONS,
  GENRE_OPTIONS,
  LYRICAL_THEME_OPTIONS,
  MOOD_OPTIONS,
  SCENE_OPTIONS,
  localizeOptions,
} from '@/src/config/mappings';
import { Button } from '@/src/components/ui/button';
import { SelectField } from '@/src/components/ui/select-field';
import { getUiCopy } from '@/src/i18n/copy';
import { StructuredSelectionBox } from '@/src/features/recommendations/components/structured-selection-box';

import type { UiLanguage } from '@/src/i18n/types';
import type { RecommendationAction } from '@/src/features/recommendations/experience-types';
import type { RecommendationPreset } from '@/src/features/recommendations/components/preset-strip';
import type { RecommendationInput } from '@/src/features/recommendations/types';

interface ContextFormProps {
  activeAction: RecommendationAction | null;
  canGenerate: boolean;
  isLoading: boolean;
  language: UiLanguage;
  values: RecommendationInput;
  onChange: (field: keyof RecommendationInput, value: string) => void;
  onGenerate: () => void;
  onSurprise: () => void;
}

export const STRUCTURED_PRESETS: RecommendationPreset[] = [
  {
    id: 'midnight-margins',
    label: { en: 'Midnight Margins', zh: '午夜页边' },
    note: { en: 'late-night work, blue, France, calm', zh: '深夜工作、蓝色、法国、平静' },
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
    label: { en: 'Kitchen Sunlight', zh: '厨房日光' },
    note: { en: 'cooking, gold, Brazil, warm', zh: '做饭、金色、巴西、温暖' },
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
    label: { en: 'Neon Footpath', zh: '霓虹步道' },
    note: { en: 'walking, red, Japan, dreamy', zh: '散步、红色、日本、梦幻' },
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
  isLoading,
  language,
  values,
  onChange,
  onGenerate,
  onSurprise,
}: ContextFormProps) {
  const copy = getUiCopy(language);

  return (
    <section className="heroPanel">
      <div className="heroCopy">
        <div className="heroLabelRow">
          <span className="heroLabelDot" aria-hidden="true" />
          <p className="heroLabel">{copy.home.label}</p>
        </div>
        <h1 className="heroTitle">
          <span className="heroTitleLine">{copy.home.titleLinePrimary}</span>
          <span className="heroTitleLine heroTitleLineSoft">{copy.home.titleLineSecondary}</span>
        </h1>
        <p className="heroText">{copy.home.description}</p>
      </div>

      <div className="museManifesto">
        <div className="manifestoBlock">
          <p className="manifestoLabel">{copy.home.howItThinks}</p>
          <p className="manifestoText">{copy.home.howItThinksText}</p>
        </div>
      </div>

      <div className="formPanel">
        <StructuredSelectionBox language={language} values={values}>
          <div className="fieldGrid">
            <SelectField
              hint={copy.fields.activity.hint}
              index="01"
              label={copy.fields.activity.label}
              options={localizeOptions(ACTIVITY_OPTIONS, language)}
              placeholder={copy.fields.activity.placeholder}
              value={values.activity ?? ''}
              onChange={(value) => onChange('activity', value)}
            />
            <SelectField
              hint={copy.fields.mood.hint}
              index="02"
              label={copy.fields.mood.label}
              options={localizeOptions(MOOD_OPTIONS, language)}
              placeholder={copy.fields.mood.placeholder}
              value={values.mood ?? ''}
              onChange={(value) => onChange('mood', value)}
            />
            <SelectField
              hint={copy.fields.color.hint}
              index="03"
              label={copy.fields.color.label}
              options={localizeOptions(COLOR_OPTIONS, language)}
              placeholder={copy.fields.color.placeholder}
              value={values.color ?? ''}
              onChange={(value) => onChange('color', value)}
            />
            <SelectField
              hint={copy.fields.country.hint}
              index="04"
              label={copy.fields.country.label}
              options={localizeOptions(COUNTRY_OPTIONS, language)}
              placeholder={copy.fields.country.placeholder}
              value={values.country ?? ''}
              onChange={(value) => onChange('country', value)}
            />
            <SelectField
              hint={copy.fields.genre.hint}
              index="05"
              label={copy.fields.genre.label}
              options={localizeOptions(GENRE_OPTIONS, language)}
              placeholder={copy.fields.genre.placeholder}
              value={values.genre ?? ''}
              onChange={(value) => onChange('genre', value)}
            />
            <SelectField
              hint={copy.fields.scene.hint}
              index="06"
              label={copy.fields.scene.label}
              options={localizeOptions(SCENE_OPTIONS, language)}
              placeholder={copy.fields.scene.placeholder}
              value={values.scene ?? ''}
              onChange={(value) => onChange('scene', value)}
            />
            <SelectField
              hint={copy.fields.lyricalTheme.hint}
              index="07"
              label={copy.fields.lyricalTheme.label}
              options={localizeOptions(LYRICAL_THEME_OPTIONS, language)}
              placeholder={copy.fields.lyricalTheme.placeholder}
              value={values.lyricalTheme ?? ''}
              onChange={(value) => onChange('lyricalTheme', value)}
            />
          </div>
        </StructuredSelectionBox>

        <div className="actionsRow">
          <Button disabled={!canGenerate || isLoading} onClick={onGenerate} type="button">
            {activeAction === 'generate' ? copy.common.composing : copy.common.generate}
          </Button>
          <Button
            disabled={!canGenerate || isLoading}
            onClick={onSurprise}
            type="button"
            variant="secondary"
          >
            {activeAction === 'surprise' ? copy.common.detouring : copy.common.addSurprise}
          </Button>
        </div>

        <p className="helperText">{copy.home.helperText}</p>
      </div>
    </section>
  );
}
