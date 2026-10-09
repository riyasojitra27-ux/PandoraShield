import React, { useState } from 'react';
import { DetectionResult } from '../types/detection';
import { RiskScore } from '../components/RiskScore';
import { SeverityBadge } from '../components/SeverityBadge';
import { EvidenceCard } from '../components/EvidenceCard';
import { ScamChain } from '../components/ScamChain';
import { RecommendationCard } from '../components/RecommendationCard';
import { FraudWarningModal } from '../components/FraudWarningModal';
import { ArrowLeft, ShieldAlert, Cpu, AlignLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';

interface ResultScreenProps {
  result: DetectionResult;
  onBack: () => void;
  onNewScan: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onBack, onNewScan }) => {
  const { simpleMode } = useSettings();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>(simpleMode ? 'simple' : 'simple');

  const getVerdictHeadline = () => {
    switch (result.severity) {
      case 'CRITICAL': return 'Critical Scam Probability';
      case 'HIGH': return 'High Risk Threat Detected';
      case 'MEDIUM': return 'Suspicious Signals Detected';
      case 'LOW': return 'Low Risk Content';
      case 'SAFE':
      default: return 'Content Appears Safe';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 lg:pb-12">
      {/* Top Bar Navigation & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          {/* Simple / Technical Mode Toggle */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex items-center shadow-sm">
            <button
              onClick={() => setViewMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'simple' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" /> Simple
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'technical' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Technical
            </button>
          </div>

          <button
            onClick={() => setShowWarningModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-xs font-semibold text-red-600 dark:text-red-300 border border-red-500/30 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Create Warning
          </button>
        </div>
      </div>

      {/* Hero Result Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
          result.severity === 'CRITICAL' ? 'bg-gradient-to-br from-red-500/10 via-white to-white dark:from-red-950/40 dark:via-slate-900 dark:to-slate-900 border-red-500/30' :
          result.severity === 'HIGH' ? 'bg-gradient-to-br from-orange-500/10 via-white to-white dark:from-orange-950/40 dark:via-slate-900 dark:to-slate-900 border-orange-500/30' :
          result.severity === 'MEDIUM' ? 'bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-amber-500/30' :
          'bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-emerald-500/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <RiskScore score={result.riskScore} severity={result.severity} size="lg" />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <SeverityBadge severity={result.severity} size="lg" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {result.inputType} scan
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getVerdictHeadline()}
            </h2>

            {viewMode === 'simple' ? (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {simpleMode ? `Plain language: ${result.explanation}` : result.explanation}
              </p>
            ) : (
              <div className="space-y-1.5 pt-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <p className="text-blue-600 dark:text-blue-300 font-bold mb-1">Technical Indicators:</p>
                {(Array.isArray(result.technicalDetails)
                  ? result.technicalDetails
                  : result.technicalDetails
                  ? [
                      `Model: ${result.technicalDetails.model || 'PandoraShield Core'}`,
                      ...(result.technicalDetails.indicators || []),
                      result.technicalDetails.confidence ? `Confidence: ${Math.round(result.technicalDetails.confidence * 100)}%` : '',
                    ].filter(Boolean)
                  : ['On-Device Heuristic & Model Verification Active']
                ).map((tech, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400">•</span> {tech}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </motion.div>

      {/* Analyzed Content Snippet */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Analyzed Input Content</span>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 line-clamp-3">
          "{result.originalInput}"
        </p>
      </div>

      {/* Why Flagged / Evidence Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1">Why this is dangerous</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Detailed security evidence extracted from on-device analysis</p>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 gap-3"
        >
          {result.evidence.map((item, idx) => (
            <EvidenceCard key={idx} item={item} />
          ))}
        </motion.div>
      </div>

      {/* Scam Chain Visualization */}
      {result.scamChain && result.scamChain.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <ScamChain stages={result.scamChain} />
        </div>
      )}

      {/* Recommendations & What to do */}
      <RecommendationCard
        verdict={(result.verdict as any) || 'SAFE'}
        recommendation={result.recommendation || (result.recommendations && result.recommendations[0]) || 'Verify suspicious contacts through official independent channels.'}
      />

      {/* Fraud Warning Modal */}

      {showWarningModal && (
        <FraudWarningModal result={result} onClose={() => setShowWarningModal(false)} />
      )}
    </div>
  );
};
