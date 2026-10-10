import React, { useState } from 'react';
import { Image, Upload, ArrowLeft } from 'lucide-react';

interface ScreenshotScannerScreenProps {
  onBack: () => void;
  onAnalyze: (input: string) => void;
}

export const ScreenshotScannerScreen: React.FC<ScreenshotScannerScreenProps> = ({ onBack, onAnalyze }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      // Read the file as a data URL so Tesseract can process it
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        // Pass the data URL prefixed with a marker so the engine knows it's an image
        onAnalyze(`__IMAGE_DATA__${dataUrl}`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 lg:pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Scan Hub
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Image className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Analyze Screenshot
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload a screenshot of a suspicious message, email, or payment request. PandoraShield will extract the text locally and analyze it.
        </p>
      </div>

      {/* Upload Box */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
          <Upload className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload a screenshot</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            PandoraShield will run local OCR (Tesseract.js) to extract visible text, then analyze it with the AI scam detection engine. Everything stays on your device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <label className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Upload Screenshot
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {previewUrl && (
          <div className="space-y-3">
            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-xl border border-slate-200 dark:border-slate-700" />
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-700 dark:text-purple-300 font-medium">
              Selected: {selectedFile} · Running local OCR + AI analysis...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
