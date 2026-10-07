import React from 'react';
import { DetectionEvidence } from '../types/detection';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface EvidenceCardProps {
  item: DetectionEvidence;
  index?: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ item }) => {
  const severity = item.severity || 'HIGH';
  const getIcon = () => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />;
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0" />;
      case 'MEDIUM':
        return <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />;
      case 'LOW':
        return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />;
      case 'SAFE':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-500/30 bg-red-500/5';
      case 'HIGH': return 'border-orange-500/30 bg-orange-500/5';
      case 'MEDIUM': return 'border-amber-500/30 bg-amber-500/5';
      case 'LOW': return 'border-blue-500/30 bg-blue-500/5';
      case 'SAFE':
      default: return 'border-emerald-500/30 bg-emerald-500/5';
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
      }}
      className={`p-4 rounded-xl border ${getBorderColor()} transition-all duration-200 shadow-xs`}
      style={{
        backgroundColor: 'var(--surface-primary)'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg border" style={{ backgroundColor: 'var(--surface-secondary)', borderColor: 'var(--border-color)' }}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              {item.type ? item.type.replace(/_/g, ' ') : 'INDICATOR'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              severity === 'CRITICAL' ? 'bg-red-500/20 text-red-600 dark:text-red-300' :
              severity === 'HIGH' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300' :
              severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300' :
              'bg-blue-500/20 text-blue-600 dark:text-blue-300'
            }`}>
              {severity}
            </span>
          </div>
          <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
