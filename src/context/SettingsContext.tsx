import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';
type TextSize = 'small' | 'default' | 'large';

interface AppSettings {
  theme: ThemeMode;
  simpleMode: boolean;
  textSize: TextSize;
  demoMode: boolean;
}

interface SettingsContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  simpleMode: boolean;
  setSimpleMode: (enabled: boolean) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  feedback: string | null;
}

const SETTINGS_STORAGE_KEY = 'pandorashield-settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  simpleMode: false,
  textSize: 'default',
  demoMode: false
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          theme: parsed.theme || DEFAULT_SETTINGS.theme,
          simpleMode: typeof parsed.simpleMode === 'boolean' ? parsed.simpleMode : DEFAULT_SETTINGS.simpleMode,
          textSize: parsed.textSize || DEFAULT_SETTINGS.textSize,
          demoMode: typeof parsed.demoMode === 'boolean' ? parsed.demoMode : DEFAULT_SETTINGS.demoMode
        };
      }
    } catch (e) {
      console.error('Failed to parse stored settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Apply theme and text size to documentElement and save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }

    // Always enforce dark mode — light/system themes are removed
    const root = document.documentElement;
    root.setAttribute('data-text-size', settings.textSize);
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  }, [settings]);

  const setTheme = (theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
    showFeedback(theme === 'dark' ? 'Dark mode enabled' : theme === 'light' ? 'Light mode enabled' : 'System theme enabled');
  };

  const setSimpleMode = (simpleMode: boolean) => {
    setSettings(prev => ({ ...prev, simpleMode }));
    showFeedback(simpleMode ? 'Simple Mode enabled' : 'Technical Mode enabled');
  };

  const setDemoMode = (demoMode: boolean) => {
    setSettings(prev => ({ ...prev, demoMode }));
    showFeedback(demoMode ? 'Demo Mode enabled' : 'Demo Mode disabled');
  };

  const setTextSize = (textSize: TextSize) => {
    setSettings(prev => ({ ...prev, textSize }));
    showFeedback(`Text size set to ${textSize}`);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme: settings.theme,
        setTheme,
        simpleMode: settings.simpleMode,
        setSimpleMode,
        demoMode: settings.demoMode,
        setDemoMode,
        textSize: settings.textSize,
        setTextSize,
        feedback
      }}
    >
      {children}
      {feedback && (
        <div className="fixed bottom-16 lg:bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-slate-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          {feedback}
        </div>
      )}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
