'use client';

import { getUiCopy } from '@/src/i18n/copy';
import { usePreferences } from '@/src/providers/preferences-provider';

const THEME_ORDER = ['light', 'dark', 'system'] as const;

const THEME_SYMBOL: Record<(typeof THEME_ORDER)[number], string> = {
  light: '◐',
  dark: '◑',
  system: '◎',
};

export function PreferenceToggles() {
  const {
    language,
    setLanguage,
    setThemePreference,
    themePreference,
  } = usePreferences();
  const copy = getUiCopy(language);

  const handleCycleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(themePreference);
    const nextTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
    setThemePreference(nextTheme);
  };

  return (
    <div className="preferenceToggleRow">
      <div className="languageToggle" role="tablist" aria-label="Language toggle">
        <button
          className={[
            'languageToggleButton',
            language === 'en' ? 'languageToggleButton-active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setLanguage('en')}
          role="tab"
          type="button"
        >
          EN
        </button>
        <button
          className={[
            'languageToggleButton',
            language === 'zh' ? 'languageToggleButton-active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setLanguage('zh')}
          role="tab"
          type="button"
        >
          CN
        </button>
      </div>

      <button className="themeCycleButton" onClick={handleCycleTheme} type="button">
        <span className="themeCycleIcon" aria-hidden="true">
          {THEME_SYMBOL[themePreference]}
        </span>
        <span className="themeCycleLabel">{copy.settings[themePreference]}</span>
      </button>
    </div>
  );
}
