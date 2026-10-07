import React from 'react';
import { DetectionResult, ProtectionEvent } from '../types/detection';
import { RiskScore } from '../components/RiskScore';
import { SeverityBadge } from '../components/SeverityBadge';
import { ArrowLeft, ShieldAlert, FileText, History, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface IncidentDetailsScreenProps {
  event?: ProtectionEvent;
  result?: DetectionResult;
  onBack: () => void;
  onCreateWarning: () => void;
  onViewEvidence: () => void;
  onViewTimeline: () => void;
}

export const IncidentDetailsScreen: React.FC<IncidentDetailsScreenProps> = ({
  event,
  result,
  onBack,
  onCreateWarning,
  onViewEvidence,
  onViewTimeline
}) => {
  const title = result ? (result.titleSnippet || result.category || 'Security Threat') : (event?.title || 'Protection Event');
  const severity = result ? result.severity : (event?.severity || 'HIGH');
  const score = result ? result.riskScore : (severity === 'CRITICAL' ? 94 : severity === 'HIGH' ? 82 : 45);
  const explanation = result ? result.explanation : (event?.description || 'Potential security risk detected and intercepted by on-device protection.');
  const recommendation = result ? result.recommendation : 'Do not open the link or provide credentials.';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Incident Header Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <RiskScore score={score} severity={severity} size="lg" />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <SeverityBadge severity={severity} size="lg" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Incident Details
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Recommended Action</h4>
            <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed font-medium">{recommendation}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={onCreateWarning}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-600 dark:text-red-300 border border-red-500/30 font-semibold text-xs transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" /> Create Warning
          </button>
          <button
            onClick={onViewEvidence}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" /> See Evidence
          </button>
          <button
            onClick={onViewTimeline}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <History className="w-4 h-4" /> View Timeline
          </button>
        </div>
      </motion.div>
    </div>
  );
};
