import React, { useState, useMemo } from 'react';
import {
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Sparkles,
  CheckSquare,
  Square,
  Lock,
  MapPin,
  Building,
  Plane,
  FileText,
  User,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhantomProfile, PhantomPrivacyControls } from '../types/phantom';
import { DEFAULT_PRESETS, INITIAL_CONTROLS, evaluatePhantomExposure } from '../data/phantomPresets';

interface PhantomScreenProps {
  onNavigateToScan?: () => void;
}

export const PhantomScreen: React.FC<PhantomScreenProps> = ({ onNavigateToScan }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tech_pro');
  const [activeProfile, setActiveProfile] = useState<PhantomProfile>(DEFAULT_PRESETS[0]);
  const [controls, setControls] = useState<PhantomPrivacyControls>(INITIAL_CONTROLS);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [activeTabSection, setActiveTabSection] = useState<'simulator' | 'action_plan'>('simulator');

  // Handle Preset Switching
  const handleSelectPreset = (preset: PhantomProfile) => {
    setSelectedPresetId(preset.id);
    setActiveProfile(preset);
    setControls(INITIAL_CONTROLS);
    setChecklist({});
  };

  // Toggle Privacy Setting
  const handleToggleControl = (key: keyof PhantomPrivacyControls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Reset Controls & Profile
  const handleResetSimulation = () => {
    setControls(INITIAL_CONTROLS);
    setChecklist({});
  };

  // Run Rule-Based Evaluation Engine
  const simulation = useMemo(() => {
    return evaluatePhantomExposure(activeProfile, controls);
  }, [activeProfile, controls]);

  // Toggle Action Item in Checklist
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Checklist stats
  const completedChecklistCount = useMemo(() => {
    return Object.values(checklist).filter(Boolean).length;
  }, [checklist]);

  return (
    <div className="space-y-8 pb-20 lg:pb-12 max-w-6xl mx-auto animate-fade-in">
      {/* HERO SECTION - PROJECT PHANTOM */}
      <div
        className="relative p-6 sm:p-8 rounded-3xl overflow-hidden border shadow-xl transition-all"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Background Cybernetic Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5" /> Project Phantom &middot; Digital Privacy Simulator
            </div>

            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Simulate Your Exposure. <br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Vanish Your Digital Footprint.
              </span>
            </h1>

            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Explore how public profiles, EXIF geotags, travel announcements, and open link sharing expose you to OSINT profiling and spear-phishing — then test real-time privacy controls to shrink your footprint.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Lock className="w-3.5 h-3.5" /> 100% On-Device Local Simulation
              </span>
              <span className="text-slate-400 dark:text-slate-600">&bull;</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Uploads
              </span>
            </div>
          </div>

          {/* Quick Score Badge Widget */}
          <div
            className="w-full lg:w-auto p-5 rounded-2xl border flex items-center justify-between lg:flex-col lg:items-center lg:justify-center gap-4 text-center shrink-0 min-w-[200px]"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Exposure Rating
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-4xl font-black text-purple-600 dark:text-purple-400">
                  {simulation.afterScore}
                </span>
                <span className="text-sm text-slate-400">/100</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              -{simulation.reductionPercentage}% Risk Exposure
            </div>
          </div>
        </div>
      </div>

      {/* SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTabSection('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTabSection === 'simulator'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" /> 1. Privacy Profile & Simulator
        </button>

        <button
          onClick={() => setActiveTabSection('action_plan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTabSection === 'action_plan'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> 2. Action Plan ({completedChecklistCount}/{simulation.totalRisks})
        </button>
      </div>

      {activeTabSection === 'simulator' && (
        <div className="space-y-8">
          {/* STEP 1: PRESET PROFILE SELECTOR */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-extrabold tracking-tight flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <User className="w-5 h-5 text-blue-500" /> Select Scenario Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a pre-configured digital persona or customize sample data to observe exposure triggers.
                </p>
              </div>

              <button
                onClick={handleResetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Controls
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEFAULT_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 group relative ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    style={{ backgroundColor: 'var(--surface-primary)' }}
                  >
                    <span className="text-2xl">{preset.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-bold truncate group-hover:text-blue-500 transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {preset.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 block truncate font-medium">
                        {preset.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: ACTIVE PROFILE DATA POINTS DISPLAY */}
          <div
            className="p-5 rounded-3xl border space-y-4 shadow-sm"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-500" /> Active Digital Profile Parameters ({activeProfile.name})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Sample Fictional Data
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Username Item */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5 text-blue-500" /> Public Handle
                </div>
                <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
                  {controls.profilePrivate ? '🔒 Private Account' : activeProfile.username}
                </p>
              </div>

              {/* Workplace Item */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Building className="w-3.5 h-3.5 text-indigo-500" /> Employer / School
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {controls.hideWorkplace ? '🙈 Hidden Details' : activeProfile.workplace}
                </p>
              </div>

              {/* Photo EXIF Item */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Photo Geotag (EXIF)
                </div>
                <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
                  {controls.stripExif ? '✨ EXIF Stripped' : activeProfile.locationPhoto.gpsCoordinates}
                </p>
              </div>

              {/* Travel Announcement Item */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Plane className="w-3.5 h-3.5 text-amber-500" /> Travel Announcement
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {controls.removeTravelPost ? '🗑️ Post Removed' : activeProfile.travelAnnouncement}
                </p>
              </div>

              {/* Shared Document Item */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" /> Shared Cloud Doc
                </div>
                <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
                  {controls.restrictDocSharing ? '🔐 Access Restricted' : activeProfile.sharedDocument.filename}
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3: INTERACTIVE CONTROLS & BEFORE vs AFTER COMPARISON GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 6 COLS: INTERACTIVE PRIVACY TOGGLES */}
            <div
              className="lg:col-span-6 p-6 rounded-3xl border space-y-5 shadow-sm"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <h3
                  className="text-base font-extrabold tracking-tight flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Sliders className="w-5 h-5 text-purple-500" /> Interactive Privacy Controls
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Toggle privacy enhancements below to simulate instant risk reduction.
                </p>
              </div>

              <div className="space-y-3">
                {/* Control 1 */}
                <div
                  onClick={() => handleToggleControl('profilePrivate')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    controls.profilePrivate
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-900 dark:text-purple-200'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Set Profile to Private
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Block unauthenticated OSINT scrapers & web crawlers
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      controls.profilePrivate ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        controls.profilePrivate ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Control 2 */}
                <div
                  onClick={() => handleToggleControl('stripExif')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    controls.stripExif
                      ? 'bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Strip EXIF GPS Metadata
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Remove geolocation tags from uploaded photos
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      controls.stripExif ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        controls.stripExif ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Control 3 */}
                <div
                  onClick={() => handleToggleControl('hideWorkplace')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    controls.hideWorkplace
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Hide Employer & School Info
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Defend against corporate spear-phishing & pretexting
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      controls.hideWorkplace ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        controls.hideWorkplace ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Control 4 */}
                <div
                  onClick={() => handleToggleControl('removeTravelPost')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    controls.removeTravelPost
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Remove Travel Announcement
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Eliminate public vacancy signals for physical security
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      controls.removeTravelPost ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        controls.removeTravelPost ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Control 5 */}
                <div
                  onClick={() => handleToggleControl('restrictDocSharing')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    controls.restrictDocSharing
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Restrict Document Link Sharing
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Switch from "Anyone with link" to explicit email grants
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      controls.restrictDocSharing ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        controls.restrictDocSharing ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 6 COLS: BEFORE vs AFTER COMPARISON & DIGITAL FOOTPRINT GRAPHIC */}
            <div
              className="lg:col-span-6 p-6 rounded-3xl border space-y-6 shadow-sm"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <h3
                  className="text-base font-extrabold tracking-tight flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <TrendingDown className="w-5 h-5 text-emerald-500" /> Simulated Exposure Comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time before vs after breakdown based on selected controls.
                </p>
              </div>

              {/* BEFORE VS AFTER SCORE CARDS */}
              <div className="grid grid-cols-2 gap-3">
                {/* BEFORE SCORE */}
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    BEFORE (Unprotected)
                  </span>
                  <div className="text-3xl font-black text-red-600 dark:text-red-400">
                    {simulation.beforeScore}
                  </div>
                  <span className="text-[10px] text-red-500/80 font-medium block">
                    {simulation.totalRisks} Inherent Risk Vectors
                  </span>
                </div>

                {/* AFTER SCORE */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    AFTER (Phantom Mode)
                  </span>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {simulation.afterScore}
                  </div>
                  <span className="text-[10px] text-emerald-500/80 font-medium block">
                    {simulation.remainingRisks} Remaining Risk Vectors
                  </span>
                </div>
              </div>

              {/* DIGITAL FOOTPRINT ANIMATED RADAR VISUAL */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-purple-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-400">
                    <EyeOff className="w-4 h-4 animate-pulse" /> Digital Footprint Transformation
                  </div>

                  {/* Dynamic Footprint Nodes Canvas Representation */}
                  <div className="h-32 flex items-center justify-center relative">
                    {/* Outer Broad Exposure Ring */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: simulation.afterScore > 40 ? 0.8 : 0.2,
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute w-28 h-28 rounded-full border-2 border-dashed border-red-500/40 flex items-center justify-center"
                    />

                    {/* Shielded Inner Boundary Ring */}
                    <motion.div
                      animate={{
                        scale: simulation.remainingRisks === 0 ? 0.7 : 0.9,
                      }}
                      className="w-20 h-20 rounded-full border-2 border-emerald-500 bg-emerald-500/15 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                    >
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">
                    {simulation.mitigatedCount} of {simulation.totalRisks} risk vectors successfully neutralized
                  </p>
                </div>
              </div>

              {/* ACTION PROGRESS SUMMARY BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Privacy Enhancement Progress</span>
                  <span className="text-emerald-500">{simulation.reductionPercentage}% Protected</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${simulation.reductionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: DETAILED EXPOSURE FINDINGS & COMBINATION ALERTS */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-lg font-extrabold tracking-tight flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Exposure Findings & Threat Rationale
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed evidence analysis explaining how each parameter contributes to your digital footprint.
              </p>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {simulation.allFindings.map((finding) => {
                  const isMitigated = controls[finding.mitigatedBy];
                  return (
                    <motion.div
                      key={finding.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-5 rounded-2xl border transition-all ${
                        isMitigated
                          ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 opacity-60'
                          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              finding.severity === 'CRITICAL'
                                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                                : finding.severity === 'HIGH'
                                ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {finding.severity} SEVERITY
                          </span>
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            {finding.categoryLabel}
                          </span>
                          {finding.isCombination && (
                            <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 text-[9px] font-extrabold uppercase">
                              Combination Risk
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          {isMitigated ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Mitigated by Privacy Control
                            </span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" /> Active Vulnerability
                            </span>
                          )}
                        </div>
                      </div>

                      <h4
                        className="text-sm font-bold mb-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {finding.title}
                      </h4>

                      <p
                        className="text-xs leading-relaxed mb-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {finding.whyItMatters}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Trigger Source Evidence
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 block">
                          {finding.triggerInfo}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PERSONALIZED ACTION PLAN CHECKLIST */}
      {activeTabSection === 'action_plan' && (
        <div className="space-y-6">
          <div
            className="p-6 rounded-3xl border space-y-4 shadow-sm"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2
                  className="text-lg font-extrabold tracking-tight flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <CheckSquare className="w-5 h-5 text-emerald-500" /> Personalized Privacy Action Plan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Step-by-step checklist based on identified vulnerabilities in your scenario profile.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  {completedChecklistCount} of {simulation.allFindings.length} Completed
                </span>
                <button
                  onClick={() => setChecklist({})}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer underline mt-0.5"
                >
                  Reset Checklist
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {simulation.allFindings.map((finding) => {
                const isChecked = !!checklist[finding.id];
                return (
                  <div
                    key={finding.id}
                    onClick={() => handleToggleChecklist(finding.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                          style={{ color: isChecked ? undefined : 'var(--text-primary)' }}
                        >
                          {finding.recommendation}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {finding.categoryLabel}
                        </span>
                      </div>
                      <p
                        className={`text-xs ${
                          isChecked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Remediates: {finding.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
