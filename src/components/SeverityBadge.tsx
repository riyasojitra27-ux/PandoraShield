import React from 'react';
import { Severity } from '../types/detection';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const getStyles = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'SAFE':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px] px-2 py-0.5 border';
      case 'lg':
        return 'text-sm px-3.5 py-1.5 border font-semibold';
      case 'md':
      default:
        return 'text-xs px-2.5 py-1 border font-medium';
    }
  };

  const getLabel = () => {
    switch (severity) {
      case 'CRITICAL': return 'Critical Risk';
      case 'HIGH': return 'High Risk';
      case 'MEDIUM': return 'Medium Risk';
      case 'LOW': return 'Low Risk';
      case 'SAFE': return 'Safe';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${getStyles()} ${getSizeStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
        severity === 'HIGH' ? 'bg-orange-500' :
        severity === 'MEDIUM' ? 'bg-amber-500' :
        severity === 'LOW' ? 'bg-blue-500' : 'bg-emerald-500'
      }`} />
      {getLabel()}
    </span>
  );
};
