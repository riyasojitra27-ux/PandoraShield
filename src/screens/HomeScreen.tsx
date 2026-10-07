import React from 'react';
import { MessageSquare, Link as LinkIcon, Image, Zap, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { ProtectionEvent } from '../types/detection';
import { SeverityBadge } from '../components/SeverityBadge';

interface HomeScreenProps {
  onNavigate: (tab: 'scan' | 'history' | 'protection' | 'message-scanner' | 'url-scanner' | 'screenshot-scanner' | 'safety-check' | 'help-someone') => void;
  onSelectEvent: (event: ProtectionEvent) => void;
  recentEvents: ProtectionEvent[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectEvent, recentEvents }) => {
  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Hero Protection Status Card */}
      <div
        className="relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl transition-colors"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(53, 201, 139, 0.15)',
              border: '1px solid rgba(53, 201, 139, 0.3)',
              color: 'var(--success-color)'
            }}
          >
            <ShieldCheck className="w-4 h-4" /> Protection Active &middot; Local-First Engine
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Stay protected before you click, pay, share, or trust.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Ready to check suspicious messages, links, and screenshots. Designed for on-device analysis so your private data stays under your control.
            </p>
          </div>

          {/* Primary Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => onNavigate('message-scanner')}
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Check Message
            </button>
            <button
              onClick={() => onNavigate('url-scanner')}
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-semibold text-sm border transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <LinkIcon className="w-4 h-4" /> Check Link
            </button>
            <button
              onClick={() => onNavigate('screenshot-scanner')}
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-semibold text-sm border transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <Image className="w-4 h-4" /> Analyze Screenshot
            </button>
            <button
              onClick={() => onNavigate('safety-check')}
              className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-semibold text-sm border transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <Zap className="w-4 h-4 text-amber-500" /> Safety Check
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Clarity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-5 rounded-2xl border flex items-start gap-3.5 shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Local-First Protection</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Designed for on-device analysis. Your private messages don't need to leave your device.
            </p>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl border flex items-start gap-3.5 shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Simple or Technical Mode</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Plain-language explanations for everyone, with deep technical indicators for advanced users.
            </p>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl border flex items-start gap-3.5 shadow-sm"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Actionable Guidance</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Know immediately what to do with clear DOs and DON'Ts and instant Fraud Warning generator.
            </p>
          </div>
        </div>
      </div>

      {/* Compact Protection Activity Section (NO timeline on Home) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Protection Activity</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Recent security events and threat interceptions</p>
          </div>
          <button
            onClick={() => onNavigate('protection')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            View all protection <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentEvents.slice(0, 2).map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {evt.title}
                  </h4>
                  <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{evt.description}</p>
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
    </div>
  );
};
