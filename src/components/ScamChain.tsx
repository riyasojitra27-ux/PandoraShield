import React from 'react';
import { ScamChainStep } from '../types/detection';
import { CheckCircle2, XCircle, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface ScamChainProps {
  stages: ScamChainStep[];
}

export const ScamChain: React.FC<ScamChainProps> = ({ stages }) => {
  return (
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
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>Attack Progression Chain</h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Step-by-step manipulation</span>
      </div>
      <div className="space-y-2">
        {stages.map((stage, idx) => {
          const title = stage.label || stage.title || stage.stage || 'Step';
          const desc = stage.description || 'Attack progression stage identified by local heuristics.';
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, x: -15 },
                show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }
              }}
              className="relative"
            >
              <div
                className="p-3.5 rounded-xl border flex items-start gap-3.5 transition-all shadow-xs"
                style={{
                  backgroundColor: stage.detected ? 'rgba(217, 45, 79, 0.08)' : 'var(--surface-primary)',
                  borderColor: stage.detected ? 'rgba(217, 45, 79, 0.3)' : 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <div className="mt-0.5">
                  {stage.detected ? (
                    <CheckCircle2 className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold" style={{ color: stage.detected ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                      {title}
                    </h4>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: stage.detected ? 'rgba(217, 45, 79, 0.15)' : 'var(--surface-secondary)',
                        color: stage.detected ? 'var(--danger-color)' : 'var(--text-muted)'
                      }}
                    >
                      {stage.detected ? 'DETECTED' : 'PASSED'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
              {idx < stages.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
