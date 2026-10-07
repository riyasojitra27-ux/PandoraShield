import React from 'react';
import { MessageSquare, Link as LinkIcon, Shield, ArrowRight } from 'lucide-react';

interface ScanScreenProps {
  onSelectScanner: (type: 'message' | 'url') => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ onSelectScanner }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" /> Threat Detection Hub
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Analyze suspicious content
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select the type of content you want to scan for scams and phishing tactics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Message Scanner Card */}
        <div
          onClick={() => onSelectScanner('message')}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                Message Scanner
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Paste a suspicious SMS, email, WhatsApp chat or other suspicious text message to analyze for urgency, brand spoofing and OTP traps.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
            <span>Open Message Scanner</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* URL Scanner Card */}
        <div
          onClick={() => onSelectScanner('url')}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <LinkIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                URL Scanner
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Check a suspicious website link or domain before opening it to uncover typosquatting and phishing portal signatures.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
            <span>Open URL Scanner</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
