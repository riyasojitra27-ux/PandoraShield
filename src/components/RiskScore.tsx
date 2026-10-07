import React from 'react';
import { Severity } from '../types/detection';

interface RiskScoreProps {
  score: number; // 0 - 100
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskScore: React.FC<RiskScoreProps> = ({ score, severity, size = 'lg' }) => {
  const getColor = () => {
    switch (severity) {
      case 'CRITICAL': return '#ef4444'; // red-500
      case 'HIGH': return '#f97316'; // orange-500
      case 'MEDIUM': return '#f59e0b'; // amber-500
      case 'LOW': return '#3b82f6'; // blue-500
      case 'SAFE':
      default: return '#10b981'; // emerald-500
    }
  };

  const color = getColor();
  const radius = size === 'lg' ? 44 : size === 'md' ? 32 : 22;
  const stroke = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimension = radius * 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={dimension}
        width={dimension}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`font-bold tracking-tight text-white ${
          size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-xs'
        }`}>
          {score}
        </span>
        {size === 'lg' && (
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            / 100
          </span>
        )}
      </div>
    </div>
  );
};
