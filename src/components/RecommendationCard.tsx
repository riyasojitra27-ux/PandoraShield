import React from 'react';
import { Verdict } from '../types/detection';
import { CheckCircle2, ShieldAlert, ShieldCheck, Ban } from 'lucide-react';

interface RecommendationCardProps {
  verdict: Verdict;
  recommendation: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ verdict, recommendation }) => {
  const isRisky = verdict === 'SCAM' || verdict === 'SUSPICIOUS';

  return (
    <div className={`p-5 rounded-2xl border ${
      isRisky ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${isRisky ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
          {isRisky ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="text-base font-bold text-white">What should you do?</h3>
          <p className="text-xs text-slate-300">Recommended action guidelines</p>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80 mb-4">
        <p className="text-sm font-medium text-slate-100 leading-relaxed">{recommendation}</p>
      </div>

      {isRisky ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Ban className="w-4 h-4" /> Do NOT
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span> Don't click any links or attachments
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span> Don't share OTPs, PINs, or passwords
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span> Don't send wire transfers or crypto
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span> Don't call back unfamiliar phone numbers provided in the text
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> DO instead
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span> Stop all communication immediately
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span> Verify through official apps or printed bank cards
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span> Report the threat to local cybercrime authorities
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span> Block the sender and delete the message
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Safe Practices
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span> Content appears clear of immediate phishing markers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span> Continue practicing vigilance with unexpected contacts
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
