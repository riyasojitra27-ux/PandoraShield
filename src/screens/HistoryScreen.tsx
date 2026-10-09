import React, { useState } from 'react';
import { DetectionResult, ScanFilter } from '../types/detection';
import { SeverityBadge } from '../components/SeverityBadge';
import { History as HistoryIcon, Search, Trash2, MessageSquare, Link as LinkIcon, Image, Zap } from 'lucide-react';

interface HistoryScreenProps {
  history: DetectionResult[];
  onSelectResult: (result: DetectionResult) => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onSelectResult, onClearHistory }) => {
  const [filter, setFilter] = useState<ScanFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredHistory = history.filter(item => {
    if (filter === 'messages' && item.inputType !== 'message') return false;
    if (filter === 'urls' && item.inputType !== 'url') return false;
    if (filter === 'screenshots' && item.inputType !== 'screenshot') return false;
    if (filter === 'safe' && item.severity !== 'SAFE' && item.severity !== 'LOW') return false;
    if (filter === 'risky' && item.severity !== 'HIGH' && item.severity !== 'CRITICAL' && item.severity !== 'MEDIUM') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInput = (item.originalInput || '').toLowerCase().includes(q);
      const matchSnippet = item.titleSnippet?.toLowerCase().includes(q) || false;
      return matchInput || matchSnippet;

    }

    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'url': return LinkIcon;
      case 'screenshot': return Image;
      case 'safety-check': return Zap;
      default: return MessageSquare;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 lg:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <HistoryIcon className="w-3.5 h-3.5" /> Security Timeline & Logs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Security History
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Review past analyses and threat logs stored locally on your device.
          </p>
        </div>

        {history.length > 0 && (
          <div>
            {showConfirmClear ? (
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-red-500/30">
                <span className="text-xs text-red-400 font-medium px-2">Clear all timeline?</span>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-red-400 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Clear History
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past scans by text or URL..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'messages', 'urls', 'screenshots', 'safe', 'risky'] as ScanFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No scans found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0 ? 'You have not performed any scans yet. Check a message or link to get started.' : 'No scans match your current filter or search query.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const Icon = getIconForType(item.inputType);
            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl shrink-0 mt-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.inputType}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium truncate group-hover:text-blue-300 transition-colors">
                      "{item.titleSnippet || item.originalInput}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-white">{item.riskScore}</span>
                    <span className="text-[10px] text-slate-500 block">Score</span>
                  </div>
                  <SeverityBadge severity={item.severity} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
