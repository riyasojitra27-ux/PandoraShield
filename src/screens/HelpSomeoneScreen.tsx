import React, { useState } from 'react';
import { HeartHandshake, ArrowLeft, MessageSquare, ShieldAlert, ArrowRight } from 'lucide-react';

interface HelpSomeoneScreenProps {
  onBack: () => void;
  onAnalyze: (text: string) => void;
}

export const HelpSomeoneScreen: React.FC<HelpSomeoneScreenProps> = ({ onBack, onAnalyze }) => {
  const [text, setText] = useState('');
  const [recipient, setRecipient] = useState('Parent / Family Member');

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <HeartHandshake className="w-3.5 h-3.5" /> Help Someone Stay Safe
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Check a message for someone else
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Not sure whether a message your parent, friend, or colleague received is safe? Paste it here to generate a plain-language explanation and warning.
        </p>
      </div>

      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Who received this message?</label>
          <div className="grid grid-cols-3 gap-2">
            {['Parent / Family', 'Friend', 'Colleague'].map((r) => (
              <button
                key={r}
                onClick={() => setRecipient(r)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  recipient === r ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Paste the suspicious message</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the message your family member or friend received..."
            rows={5}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none"
          />
        </div>

        <button
          onClick={() => {
            if (text.trim()) {
              onAnalyze(text);
            }
          }}
          disabled={!text.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <ShieldAlert className="w-5 h-5" /> Analyze for {recipient} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
