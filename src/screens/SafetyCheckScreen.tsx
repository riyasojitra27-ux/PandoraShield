import React, { useState } from 'react';
import { Zap, ArrowLeft, ShieldCheck, ArrowRight, Link as LinkIcon, DollarSign, KeyRound, Download, UserCheck, MessageSquareWarning } from 'lucide-react';

interface SafetyCheckScreenProps {
  onBack: () => void;
  onRunCheck: (action: string) => void;
}

export const SafetyCheckScreen: React.FC<SafetyCheckScreenProps> = ({ onBack, onRunCheck }) => {
  const [selectedAction, setSelectedAction] = useState<string>('Open a suspicious link');

  const actions = [
    { id: 'Open a suspicious link', label: 'Open a suspicious link', icon: LinkIcon },
    { id: 'Make an online payment or wire transfer', label: 'Make an online payment or wire transfer', icon: DollarSign },
    { id: 'Share an OTP, PIN, or password', label: 'Share an OTP, PIN, or password', icon: KeyRound },
    { id: 'Download an unknown APK or app file', label: 'Download an unknown APK or app file', icon: Download },
    { id: 'Share personal identification or ID copy', label: 'Share personal identification or ID copy', icon: UserCheck },
    { id: 'Reply to an unfamiliar sender or call back', label: 'Reply to an unfamiliar sender or call back', icon: MessageSquareWarning }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Scan Hub
        </button>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" /> Safety Check ("Before You Act")
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          What are you about to do?
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select an action to get an instant safety assessment before taking risks.
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          const isSelected = selectedAction === act.id;
          return (
            <div
              key={act.id}
              onClick={() => setSelectedAction(act.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold">{act.label}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700'}`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onRunCheck(selectedAction)}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
      >
        <ShieldCheck className="w-5 h-5" /> Run Safety Assessment <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
