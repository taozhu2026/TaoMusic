'use client';

import { Button } from '@/src/components/ui/button';
import { getUiCopy } from '@/src/i18n/copy';
import { usePreferences } from '@/src/providers/preferences-provider';

export function SettingsPanel() {
  const {
    language,
    setLanguage,
    setThemePreference,
    themePreference,
  } = usePreferences();
  const copy = getUiCopy(language);

  return (
    <div className="settingsPanel">
      <div className="settingsPanelHeader">
        <div>
          <p className="manifestoLabel">{copy.settings.title}</p>
          <p className="helperText">{copy.settings.subtitle}</p>
        </div>
      </div>

      <div className="settingsGroup">
        <span className="settingsGroupLabel">{copy.settings.theme}</span>
        <div className="settingsOptionRow">
          {(['light', 'dark', 'system'] as const).map((value) => (
            <Button
              className={themePreference === value ? 'settingsOptionActive' : ''}
              key={value}
              onClick={() => setThemePreference(value)}
              type="button"
              variant={themePreference === value ? 'primary' : 'secondary'}
            >
              {copy.settings[value]}
            </Button>
          ))}
        </div>
      </div>

      <div className="settingsGroup">
        <span className="settingsGroupLabel">{copy.settings.language}</span>
        <div className="settingsOptionRow">
          <Button
            className={language === 'en' ? 'settingsOptionActive' : ''}
            onClick={() => setLanguage('en')}
            type="button"
            variant={language === 'en' ? 'primary' : 'secondary'}
          >
            {copy.settings.english}
          </Button>
          <Button
            className={language === 'zh' ? 'settingsOptionActive' : ''}
            onClick={() => setLanguage('zh')}
            type="button"
            variant={language === 'zh' ? 'primary' : 'secondary'}
          >
            {copy.settings.chinese}
          </Button>
        </div>
      </div>
    </div>
  );
}
