import React, { useState } from 'react';
import { Image, Sparkles, Upload, ArrowLeft, Shield } from 'lucide-react';

interface ScreenshotScannerScreenProps {
  onBack: () => void;
  onAnalyze: (input: string) => void;
}

export const ScreenshotScannerScreen: React.FC<ScreenshotScannerScreenProps> = ({ onBack, onAnalyze }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleDemoScreenshot = () => {
    setSelectedFile('Suspicious_Bank_KYC_Screenshot.png');
    onAnalyze('Suspicious screenshot containing bank account block threat and fraudulent link http://hdfc-kyc-verify-portal.net');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      onAnalyze(`Uploaded image: ${file.name} containing payment transfer request text.`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Scan Hub
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Image className="w-6 h-6 text-purple-400" /> Analyze Screenshot
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Share a screenshot of a suspicious message, email, or payment request.
        </p>
      </div>

      {/* Upload Box & Demo */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <Upload className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-base font-bold text-white">Upload or select a screenshot</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            PandoraShield will run OCR text extraction to analyze visible messages, links, and payment prompts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <label className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Upload Screenshot
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleDemoScreenshot}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> Use Demo Screenshot
          </button>
        </div>

        {selectedFile && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 font-medium">
            Selected: {selectedFile} &middot; Initializing OCR analysis...
          </div>
        )}
      </div>
    </div>
  );
};
