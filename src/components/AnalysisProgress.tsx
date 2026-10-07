import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
  inputType: 'message' | 'url';
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete, inputType }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Reading content & extracting entities', description: 'Parsing text structure and identifying embedded domains.' },
    { title: 'Detecting suspicious signals', description: 'Checking against known phishing vectors and urgency triggers.' },
    { title: 'Building evidence matrix', description: 'Analyzing brand impersonation and credential harvesting risks.' },
    { title: 'Reconstructing scam chain', description: 'Mapping attack progression and psychological manipulation tactics.' },
    { title: 'Calculating final risk score', description: 'Synthesizing confidence score and security verdict.' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center relative shadow-2xl shadow-blue-500/10">
          <Shield className="w-12 h-12 text-blue-400 animate-pulse" />
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 p-1.5 rounded-full">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
        Analyzing {inputType === 'message' ? 'Message' : 'URL'}
      </h2>
      <p className="text-sm text-slate-400 mb-8">
        PandoraShield local-first heuristic analysis engine in progress...
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-2 mb-8 overflow-hidden border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps checklist */}
      <div className="w-full space-y-3 text-left bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className={`flex items-start gap-3 transition-all duration-300 ${
              idx > currentStep ? 'opacity-40' : 'opacity-100'
            }`}>
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-semibold ${isCurrent ? 'text-blue-300' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                  {step.title}
                </h4>
                {isCurrent && (
                  <p className="text-[11px] text-slate-400 mt-0.5 animate-pulse">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
