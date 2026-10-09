import React, { useState } from 'react';
import { MessageSquare, Sparkles, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/mockDetections';
import { useSettings } from '../context/SettingsContext';

interface MessageScannerScreenProps {
  onBack: () => void;
  onAnalyze: (text: string) => void;
}

export const MessageScannerScreen: React.FC<MessageScannerScreenProps> = ({ onBack, onAnalyze }) => {
  const { demoMode } = useSettings();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleAnalyzeClick = () => {
    if (!text.trim()) {
      setError('Paste a message before analyzing.');
      return;
    }
    setError('');
    onAnalyze(text);
  };

  const handleClear = () => {
    setText('');
    setError('');
  };

  const loadDemo = (key: string) => {
    const scenario = DEMO_SCENARIOS[key];
    if (scenario) {
      setText(scenario.originalInput || '');
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
          <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Check a Message
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Paste a suspicious SMS, WhatsApp message, email, or chat here.
        </p>
      </div>

      {/* Demo Scenarios Quick Pick (Only if demoMode is true) */}
      {demoMode && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Demo Mode Enabled
            </div>
            <span className="text-[10px] text-slate-400">Quick scenario shortcuts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadDemo('bank-kyc')}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer font-medium"
            >
              Fake Bank KYC
            </button>
            <button
              onClick={() => loadDemo('courier-delivery')}
              className="text-xs px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-300 hover:bg-orange-500/20 transition-all cursor-pointer font-medium"
            >
              Fake Courier
            </button>
            <button
              onClick={() => loadDemo('job-offer')}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer font-medium"
            >
              Fake Job Offer
            </button>
            <button
              onClick={() => loadDemo('lottery-reward')}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer font-medium"
            >
              Lottery Scam
            </button>
            <button
              onClick={() => loadDemo('otp-scam')}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer font-medium"
            >
              OTP Scam
            </button>
            <button
              onClick={() => loadDemo('payment-scam')}
              className="text-xs px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-300 hover:bg-orange-500/20 transition-all cursor-pointer font-medium"
            >
              Payment Scam
            </button>
            <button
              onClick={() => loadDemo('safe-bank')}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer font-medium"
            >
              Safe Bank Notice
            </button>
            <button
              onClick={() => loadDemo('safe-delivery')}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer font-medium"
            >
              Safe Delivery
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste SMS, WhatsApp message, email, or chat here..."
            rows={6}
            className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 font-medium">
            {text.length} chars
          </div>
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            Analyze Message
          </button>
        </div>
      </div>
    </div>
  );
};
