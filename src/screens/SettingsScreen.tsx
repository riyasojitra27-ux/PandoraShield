import React, { useState } from 'react';
import { Settings as SettingsIcon, Lock, Cpu, Trash2, Check, Info, RefreshCw, Sun, Moon, Monitor, Sliders, Volume2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface SettingsScreenProps {
  onClearHistory: () => void;
  totalScansCount: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClearHistory, totalScansCount }) => {
  const { theme, setTheme, simpleMode, setSimpleMode, demoMode, setDemoMode, textSize, setTextSize } = useSettings();
  const [cleared, setCleared] = useState(false);
  const [engineStatus] = useState('Active (Local ONNX Heuristics v2.4)');
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [readAloudEnabled, setReadAloudEnabled] = useState(false);

  const handleClear = () => {
    onClearHistory();
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" /> App Control Center
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage appearance themes, accessibility, detection preferences, and privacy.
        </p>
      </div>

      <div className="space-y-4">
        {/* APPEARANCE SECTION */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred theme style</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-xs font-semibold">System Default</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-semibold">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-semibold">Dark</span>
            </button>
          </div>
        </div>

        {/* ACCESSIBILITY SECTION */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Accessibility</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tailor readability and explanations</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Text Size</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Adjust UI font size scale</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                {(['small', 'default', 'large'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setTextSize(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      textSize === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Simple Explanations</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Use plain language instead of technical jargon</p>
              </div>
              <button
                onClick={() => setSimpleMode(!simpleMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                  simpleMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${simpleMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

          </div>
        </div>

        {/* DETECTION PREFERENCES */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Detection Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure engine and capabilities</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Local-First Detection</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Always process data locally</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Enforced</span>
            </div>
          </div>
        </div>

        {/* PRIVACY CENTER */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy Center</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Zero unnecessary permissions & local analysis</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Stored Scan Logs</span>
              <span className="text-slate-900 dark:text-white font-semibold">{totalScansCount} items stored locally</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">User-Controlled Analysis</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Clear all locally cached history</span>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              {cleared ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
              {cleared ? 'History Cleared' : 'Clear Scan History'}
            </button>
          </div>
        </div>

        {/* ABOUT & PROTOTYPE STATUS */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">PandoraShield</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Version 2.4.0 &middot; Local-First AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
