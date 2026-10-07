import React, { useState } from 'react';
import { Link as LinkIcon, Sparkles, Trash2, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import { DEMO_URLS } from '../data/mockDetections';
import { useSettings } from '../context/SettingsContext';

interface UrlScannerScreenProps {
  onBack: () => void;
  onAnalyze: (url: string) => void;
}

export const UrlScannerScreen: React.FC<UrlScannerScreenProps> = ({ onBack, onAnalyze }) => {
  const { demoMode } = useSettings();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleAnalyzeClick = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Enter a URL before analyzing.');
      return;
    }
    setError('');
    onAnalyze(trimmed);
  };

  const handleClear = () => {
    setUrl('');
    setError('');
  };

  const loadDemo = (key: string) => {
    const scenario = DEMO_URLS[key];
    if (scenario) {
      setUrl(scenario.originalInput);
      setError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Scan Hub
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Check Before You Open
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Paste a link before opening it to verify its safety.
        </p>
      </div>

      {/* Safety Reminder */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
          <strong className="font-semibold text-amber-700 dark:text-amber-300">Safety Warning:</strong> Don't open a suspicious link directly in your browser just to find out if it is safe. Let PandoraShield analyze it first.
        </div>
      </div>

      {/* Demo URLs (Only if demoMode is true) */}
      {demoMode && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Demo Mode Enabled
            </div>
            <span className="text-[10px] text-slate-400">Quick URL shortcuts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadDemo('phishing-login')}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/25 transition-all cursor-pointer font-medium"
            >
              Phishing Login Portal
            </button>
            <button
              onClick={() => loadDemo('safe-site')}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer font-medium"
            >
              Safe Domain (GitHub)
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="https://... paste link here"
            className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>

          <button
            onClick={handleAnalyzeClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Analyze Link
          </button>
        </div>
      </div>
    </div>
  );
};
