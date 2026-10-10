import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, EyeOff, Search, ChevronRight, Activity, ScanLine, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeXRay, XRayResult } from '../core/forensics/xray';
import { compareStylometry, StylometryResult } from '../core/forensics/stylometry';
import { injectCanary } from '../core/forensics/canary';
import { Copy } from 'lucide-react';

export const ForensicsHubScreen: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'hub' | 'xray' | 'stylometry' | 'canary'>('hub');
  
  // X-Ray State
  const [xrayInput, setXrayInput] = useState('');
  const [xrayResult, setXrayResult] = useState<XRayResult | null>(null);

  // Stylometry State
  const [baselineInput, setBaselineInput] = useState('');
  const [suspectInput, setSuspectInput] = useState('');
  const [stylometryResult, setStylometryResult] = useState<StylometryResult | null>(null);

  // Canary State
  const [canaryText, setCanaryText] = useState('');
  const [canaryTag, setCanaryTag] = useState('');
  const [canaryResult, setCanaryResult] = useState('');

  const handleRunXRay = () => {
    if (!xrayInput) return;
    setXrayResult(analyzeXRay(xrayInput));
  };

  const handleRunStylometry = () => {
    if (!baselineInput || !suspectInput) return;
    setStylometryResult(compareStylometry(baselineInput, suspectInput));
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-12 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl border shadow-xl transition-all bg-slate-900 border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" /> Cyber-Forensics Deep Scan Lab
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Advanced Intelligence Toolkit
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTool === 'hub' && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Tool 1: X-Ray Scanner */}
            <div
              onClick={() => setActiveTool('xray')}
              className="p-6 rounded-3xl border bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
            >
              <div className="p-3 w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">X-Ray Vision</h3>
              <p className="text-sm text-slate-400 mb-4">
                Reveal invisible characters, zero-width joiners, and Cyrillic homoglyph attacks hidden inside URLs and messages.
              </p>
              <span className="text-xs font-bold text-cyan-500 flex items-center gap-1">
                Launch Tool <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            {/* Tool 2: Imposter ID */}
            <div
              onClick={() => setActiveTool('stylometry')}
              className="p-6 rounded-3xl border bg-slate-900/60 border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
            >
              <div className="p-3 w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Imposter ID (Stylometry)</h3>
              <p className="text-sm text-slate-400 mb-4">
                Linguistic fingerprinting. Compare the writing style of a suspicious message against known past messages from your boss or friend.
              </p>
              <span className="text-xs font-bold text-purple-500 flex items-center gap-1">
                Launch Tool <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            {/* Tool 3: Project Canary */}
            <div
              onClick={() => setActiveTool('canary')}
              className="p-6 rounded-3xl border bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group md:col-span-2"
            >
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Project Canary (Data Landmines)</h3>
              <p className="text-sm text-slate-400 mb-4 max-w-2xl">
                Weaponize zero-width characters to trap scammers. Inject an invisible cryptographic signature into your public bio (e.g., LinkedIn). If a scammer scrapes it and sends you a phishing email, PandoraShield will instantly trace the leaked data.
              </p>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                Launch Tool <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        )}

        {/* X-RAY TOOL */}
        {activeTool === 'xray' && (
          <motion.div
            key="xray"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setActiveTool('hub')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
            >
              &larr; Back to Lab
            </button>
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <ScanLine className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">X-Ray Scanner</h2>
                  <p className="text-xs text-slate-400">Paste text to reveal invisible malicious characters</p>
                </div>
              </div>
              <textarea
                value={xrayInput}
                onChange={(e) => setXrayInput(e.target.value)}
                placeholder="Paste suspicious URL or message here. (Tip: Scammers often use invisible characters to bypass spam filters)"
                className="w-full h-32 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:border-cyan-500 outline-none resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRunXRay}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm"
                >
                  Run X-Ray Scan
                </button>
                <button
                  onClick={() => {
                    // Inject a demo homoglyph and zero-width string
                    setXrayInput('http://pаypal.com/secure\u200B-login');
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
                >
                  Load Demo Attack
                </button>
              </div>

              {xrayResult && (
                <div className="mt-6 space-y-4 p-4 rounded-2xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-300">Scan Results</h3>
                    {xrayResult.isClean ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        CLEAN (No hidden characters)
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/30">
                        {xrayResult.findings.length} HIDDEN VULNERABILITIES DETECTED
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-lg break-all leading-relaxed">
                    {xrayResult.highlightedNodes.map((node, i) => (
                      <span
                        key={i}
                        className={
                          node.isMalicious
                            ? 'bg-red-500 text-white px-1 rounded font-bold mx-0.5 shadow-[0_0_10px_rgba(239,68,68,0.8)] relative group cursor-help'
                            : 'text-slate-300'
                        }
                      >
                        {node.isMalicious ? (node.text === '\u200B' ? '[ZWSP]' : node.text) : node.text}
                      </span>
                    ))}
                  </div>

                  {xrayResult.findings.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {xrayResult.findings.map((f, i) => (
                        <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-red-400 block mb-0.5">{f.type}</span>
                            <span className="text-xs text-slate-300">{f.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STYLOMETRY TOOL */}
        {activeTool === 'stylometry' && (
          <motion.div
            key="stylometry"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setActiveTool('hub')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
            >
              &larr; Back to Lab
            </button>
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Fingerprint className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Imposter ID</h2>
                  <p className="text-xs text-slate-400">Linguistic Fingerprinting Engine</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baseline Knowledge</label>
                  <textarea
                    value={baselineInput}
                    onChange={(e) => setBaselineInput(e.target.value)}
                    placeholder="Paste 3-5 real past messages from your boss or friend here to establish their writing style..."
                    className="w-full h-40 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-purple-500 outline-none resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suspicious Message</label>
                  <textarea
                    value={suspectInput}
                    onChange={(e) => setSuspectInput(e.target.value)}
                    placeholder="Paste the suspicious new message here..."
                    className="w-full h-40 p-4 rounded-xl bg-slate-950 border border-red-900/50 text-slate-200 text-sm focus:border-purple-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRunStylometry}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm"
                >
                  Extract Linguistic Fingerprint
                </button>
                <button
                  onClick={() => {
                    setBaselineInput("Hey team, I'm heading out for lunch. Please make sure the quarterly report is finished by 5 PM! Let me know if you need any help, thanks.");
                    setSuspectInput("urgent request. i need u to buy $500 apple gift cards for client right now. do not call me i am in a meeting");
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
                >
                  Load Demo Example
                </button>
              </div>

              {stylometryResult && (
                <div className="mt-6 space-y-4 p-5 rounded-2xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-300">Stylometry Match Analysis</h3>
                      <p className="text-xs text-slate-500">Comparing punctuation density, lexical richness, and casing patterns.</p>
                    </div>
                    
                    <div className="text-center">
                      <span className={`text-3xl font-black ${
                        stylometryResult.verdict === 'MATCH' ? 'text-emerald-500' :
                        stylometryResult.verdict === 'IMPOSTER' ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        {stylometryResult.matchScore}%
                      </span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Confidence Score
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {stylometryResult.deviations.map((dev, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${
                        dev.isAnomalous ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">{dev.metric}</span>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Baseline: {dev.baselineValue.toFixed(1)}</span>
                            <span className={`text-xs font-bold ${dev.isAnomalous ? 'text-red-400' : 'text-slate-200'}`}>
                              Suspect: {dev.suspectValue.toFixed(1)}
                            </span>
                          </div>
                          {dev.isAnomalous && (
                            <AlertTriangle className="w-4 h-4 text-red-400 mb-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 mt-4 ${
                    stylometryResult.verdict === 'IMPOSTER' ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                    stylometryResult.verdict === 'MATCH' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                    'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  }`}>
                    {stylometryResult.verdict === 'IMPOSTER' ? <AlertTriangle className="w-5 h-5 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 mt-0.5" />}
                    <div>
                      <h4 className="text-sm font-bold">
                        {stylometryResult.verdict === 'IMPOSTER' ? 'HIGH PROBABILITY OF IMPOSTER' :
                         stylometryResult.verdict === 'MATCH' ? 'WRITING STYLE MATCHES BASELINE' :
                         'INCONCLUSIVE MATCH'}
                      </h4>
                      <p className="text-xs mt-1 opacity-80">
                        {stylometryResult.verdict === 'IMPOSTER' 
                          ? 'The suspicious message has significant linguistic deviations from the baseline (e.g., completely different punctuation usage or grammar level). Do not trust the sender identity.'
                          : 'The linguistic fingerprint of the suspicious message closely aligns with the baseline knowledge.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CANARY TOOL */}
        {activeTool === 'canary' && (
          <motion.div
            key="canary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setActiveTool('hub')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
            >
              &larr; Back to Lab
            </button>
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Project Canary</h2>
                  <p className="text-xs text-slate-400">Invisible Data Landmine Generator</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Profile Text</label>
                  <textarea
                    value={canaryText}
                    onChange={(e) => setCanaryText(e.target.value)}
                    placeholder="Enter the bio or text you want to post publicly (e.g. your resume summary)..."
                    className="w-full h-40 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 outline-none resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Tag (The Trap)</label>
                    <input
                      type="text"
                      value={canaryTag}
                      onChange={(e) => setCanaryTag(e.target.value)}
                      placeholder="e.g., LINKEDIN_PROFILE_2023"
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-sm font-bold text-white mb-2">How this works:</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      This tool converts your Source Tag into a cryptographic binary code of <strong>invisible zero-width characters</strong> and injects it into your Public Profile Text. 
                      You can copy and paste the result to LinkedIn, Tinder, or a public resume. It will look perfectly normal. 
                      <br/><br/>
                      If an AI scraper copies your profile and a scammer uses it to write you a spear-phishing email, pasting that email into PandoraShield's Message Scanner will instantly trigger the hidden landmine, proving exactly where your data was stolen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (canaryText && canaryTag) {
                      setCanaryResult(injectCanary(canaryText, canaryTag));
                    }
                  }}
                  disabled={!canaryText || !canaryTag}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm"
                >
                  Generate Invisible Landmine
                </button>
              </div>

              {canaryResult && (
                <div className="mt-6 space-y-4 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-400">Weaponized Text Ready</h3>
                      <p className="text-xs text-emerald-500/70">The text below contains an invisible cryptographic tag. Do not edit it manually.</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(canaryResult);
                        alert("Copied to clipboard! The invisible tag is embedded.");
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Copy to Clipboard
                    </button>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap font-mono">
                    {canaryResult}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
