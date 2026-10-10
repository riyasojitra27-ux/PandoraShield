import React, { useState, useEffect } from 'react';
import { ActiveTab, Navigation } from './components/Navigation';
import { HomeScreen } from './screens/HomeScreen';
import { ScanHubScreen } from './screens/ScanHubScreen';
import { MessageScannerScreen } from './screens/MessageScannerScreen';
import { UrlScannerScreen } from './screens/UrlScannerScreen';
import { ScreenshotScannerScreen } from './screens/ScreenshotScannerScreen';
import { SafetyCheckScreen } from './screens/SafetyCheckScreen';
import { HelpSomeoneScreen } from './screens/HelpSomeoneScreen';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ResultScreen } from './screens/ResultScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProtectionScreen } from './screens/ProtectionScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { IncidentDetailsScreen } from './screens/IncidentDetailsScreen';
import { FraudWarningModal } from './components/FraudWarningModal';
import { DetectionResult, InputType, ProtectionEvent } from './types/detection';
import { getStoredHistory, clearStoredHistory, analyzeText, analyzeUrl, analyzeScreenshot, runSafetyCheck, getStoredProtectionEvents } from './services/detectionService';
import { SettingsProvider } from './context/SettingsContext';

type ExtendedTab = ActiveTab | 'message-scanner' | 'url-scanner' | 'screenshot-scanner' | 'safety-check' | 'help-someone' | 'analysis' | 'result' | 'incident-details';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ExtendedTab>('home');
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [protectionEvents, setProtectionEvents] = useState<ProtectionEvent[]>([]);
  const [selectedResult, setSelectedResult] = useState<DetectionResult | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ProtectionEvent | null>(null);
  const [pendingInput, setPendingInput] = useState<{ type: InputType; value: string } | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    setHistory(getStoredHistory());
    setProtectionEvents(getStoredProtectionEvents());
  }, []);

  const handleStartScanType = (type: 'message' | 'url') => {
    if (type === 'message') {
      setActiveTab('message-scanner');
    } else {
      setActiveTab('url-scanner');
    }
  };

  const handleTriggerAnalysis = async (type: InputType, value: string) => {
    setPendingInput({ type, value });
    setActiveTab('analysis');
  };

  const handleAnalysisComplete = async () => {
    if (!pendingInput) {
      setActiveTab('home');
      return;
    }

    try {
      let result: DetectionResult;
      if (pendingInput.type === 'message') {
        result = await analyzeText(pendingInput.value);
      } else if (pendingInput.type === 'url') {
        result = await analyzeUrl(pendingInput.value);
      } else if (pendingInput.type === 'screenshot') {
        result = await analyzeScreenshot(pendingInput.value);
      } else {
        result = await runSafetyCheck(pendingInput.value);
      }

      setHistory(getStoredHistory());
      setProtectionEvents(getStoredProtectionEvents());
      setSelectedResult(result);
      setActiveTab('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setActiveTab('home');
    } finally {
      setPendingInput(null);
    }
  };

  const handleClearHistory = () => {
    clearStoredHistory();
    setHistory([]);
  };

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-blue-500 selection:text-white transition-colors"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Top Header & Navigation Rail */}
      <Navigation
        activeTab={activeTab === 'message-scanner' || activeTab === 'url-scanner' || activeTab === 'screenshot-scanner' || activeTab === 'safety-check' || activeTab === 'help-someone' || activeTab === 'analysis' || activeTab === 'result' || activeTab === 'incident-details' ? 'scan' : (activeTab as ActiveTab)}
        setActiveTab={(tab) => setActiveTab(tab)}
        onStartScan={handleStartScanType}
      />

      {/* Main Content Area with safe bottom padding for mobile navigation */}
      <main className="flex-1 lg:pl-64 pt-6 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full pb-28 lg:pb-12">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectEvent={(evt) => {
              setSelectedEvent(evt);
              setActiveTab('incident-details');
            }}
            recentEvents={protectionEvents}
          />
        )}

        {activeTab === 'scan' && (
          <ScanHubScreen onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'message-scanner' && (
          <MessageScannerScreen
            onBack={() => setActiveTab('scan')}
            onAnalyze={(text) => handleTriggerAnalysis('message', text)}
          />
        )}

        {activeTab === 'url-scanner' && (
          <UrlScannerScreen
            onBack={() => setActiveTab('scan')}
            onAnalyze={(url) => handleTriggerAnalysis('url', url)}
          />
        )}

        {activeTab === 'screenshot-scanner' && (
          <ScreenshotScannerScreen
            onBack={() => setActiveTab('scan')}
            onAnalyze={(input) => handleTriggerAnalysis('screenshot', input)}
          />
        )}

        {activeTab === 'safety-check' && (
          <SafetyCheckScreen
            onBack={() => setActiveTab('scan')}
            onRunCheck={(action) => handleTriggerAnalysis('safety-check', action)}
          />
        )}

        {activeTab === 'help-someone' && (
          <HelpSomeoneScreen
            onBack={() => setActiveTab('home')}
            onAnalyze={(text) => handleTriggerAnalysis('message', text)}
          />
        )}

        {activeTab === 'analysis' && pendingInput && (
          <AnalysisProgress
            inputType={pendingInput.type === 'message' || pendingInput.type === 'screenshot' || pendingInput.type === 'safety-check' ? 'message' : 'url'}
            onComplete={handleAnalysisComplete}
          />
        )}

        {activeTab === 'result' && selectedResult && (
          <ResultScreen
            result={selectedResult}
            onBack={() => setActiveTab('home')}
            onNewScan={() => setActiveTab('scan')}
          />
        )}

        {activeTab === 'incident-details' && (
          <IncidentDetailsScreen
            event={selectedEvent || undefined}
            result={selectedResult || undefined}
            onBack={() => setActiveTab('protection')}
            onCreateWarning={() => setShowWarningModal(true)}
            onViewEvidence={() => {
              if (selectedResult) {
                setActiveTab('result');
              } else {
                setActiveTab('history');
              }
            }}
            onViewTimeline={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            history={history}
            onSelectResult={(res) => {
              setSelectedResult(res);
              setActiveTab('result');
            }}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'protection' && (
          <ProtectionScreen
            onSelectEvent={(evt) => {
              setSelectedEvent(evt);
              setActiveTab('incident-details');
            }}
            events={protectionEvents}
            onRefreshEvents={() => setProtectionEvents(getStoredProtectionEvents())}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            onClearHistory={handleClearHistory}
            totalScansCount={history.length}
          />
        )}
      </main>

      {showWarningModal && selectedResult && (
        <FraudWarningModal result={selectedResult} onClose={() => setShowWarningModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
