import React, { useState } from 'react';
import { ShieldCheck, Zap, RefreshCw, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProtectionEvent } from '../types/detection';
import { getStoredProtectionEvents, simulateLiveProtectionEvent } from '../services/detectionService';
import { SeverityBadge } from '../components/SeverityBadge';

interface ProtectionScreenProps {
  onSelectEvent: (event: ProtectionEvent) => void;
  events: ProtectionEvent[];
  onRefreshEvents: () => void;
}

export const ProtectionScreen: React.FC<ProtectionScreenProps> = ({ onSelectEvent, events, onRefreshEvents }) => {
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      simulateLiveProtectionEvent();
      onRefreshEvents();
      setSimulating(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 lg:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Live Protection Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Protection Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Simulated local protection events and threat interception logs. Click any event to inspect incident details.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
          {simulating ? 'Simulating Event...' : 'Simulate Protection Event'}
        </button>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-sm">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white font-semibold">Demo Protection Simulation:</strong> This feed simulates on-device threat interception events (e.g., blocked malicious links and phishing SMS alerts). The web prototype does not monitor your live device operating system.
        </div>
      </div>

      {/* Events Feed */}
      <div className="space-y-3">
        {events.map((evt) => (
          <div
            key={evt.id}
            onClick={() => onSelectEvent(evt)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {evt.severity === 'CRITICAL' || evt.severity === 'HIGH' ? (
                  <ShieldAlert className="w-5 h-5 text-red-500 dark:text-red-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">Demo Simulation</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{evt.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{evt.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <SeverityBadge severity={evt.severity} size="sm" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
