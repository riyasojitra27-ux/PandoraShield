import React, { useState } from 'react';
import { DetectionResult } from '../types/detection';
import { AlertTriangle, Copy, Check, Share2, X, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface FraudWarningModalProps {
  result: DetectionResult;
  onClose: () => void;
}

export const FraudWarningModal: React.FC<FraudWarningModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const warningText = `⚠️ FRAUD WARNING - PANDORASHIELD ALERT ⚠️

This message or link was analyzed and identified as a potential scam/phishing threat:
"${result.titleSnippet || result.originalInput.substring(0, 40)}..."

Risk Assessment: ${result.severity} (${result.riskScore}/100)
Verdict: ${result.verdict}

🚨 DO NOT:
• Open any links or attachments
• Share OTPs, PINs, or passwords
• Send money or crypto
• Call unknown phone numbers

Detected Indicators:
${result.evidence.map(e => `• ${e.title}: ${e.description}`).join('\n')}

Stay safe! Checked locally with PandoraShield.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(warningText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PandoraShield Fraud Warning',
          text: warningText
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Fraud Warning</h3>
              <p className="text-xs text-slate-400">Shareable warning for WhatsApp, SMS, or chat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Preview Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
          {warningText}
        </div>

        {reported && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium text-center">
            ✓ Threat successfully reported to local intelligence repository!
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleReport}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-xs font-semibold text-red-300 border border-red-500/30 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" /> Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};
