import React from 'react';
import { MessageSquare, Link as LinkIcon, Image, Zap, HeartHandshake, Shield, ArrowRight } from 'lucide-react';

interface ScanHubScreenProps {
  onNavigate: (tab: 'message-scanner' | 'url-scanner' | 'screenshot-scanner' | 'safety-check' | 'help-someone') => void;
}

export const ScanHubScreen: React.FC<ScanHubScreenProps> = ({ onNavigate }) => {
  const options = [
    {
      id: 'message-scanner',
      title: 'Check a Message',
      desc: 'Paste a suspicious SMS, WhatsApp message, email, or chat text to analyze.',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: 'url-scanner',
      title: 'Check a Link',
      desc: 'Paste a link before opening it to uncover phishing & typosquatted domains.',
      icon: LinkIcon,
      color: 'indigo'
    },
    {
      id: 'screenshot-scanner',
      title: 'Analyze Screenshot',
      desc: 'Share a screenshot of a suspicious message, email, or payment request.',
      icon: Image,
      color: 'purple'
    },
    {
      id: 'safety-check',
      title: 'Safety Check ("Before You Act")',
      desc: "Check before you click a link, share an OTP, make a payment, or download an APK.",
      icon: Zap,
      color: 'amber'
    },
    {
      id: 'help-someone',
      title: 'Help Someone',
      desc: 'Not sure whether a message your parent, friend, or colleague received is safe?',
      icon: HeartHandshake,
      color: 'emerald'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" /> Threat Detection Hub
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Choose a scanning option
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select what you want to check for scams and phishing tactics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => onNavigate(opt.id as any)}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
                <span>Start check</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
