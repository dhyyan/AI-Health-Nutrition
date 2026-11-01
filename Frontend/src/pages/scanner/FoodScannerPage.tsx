import React, { useState } from 'react';
import { scannerApi, ScanResultData } from '../../services/scannerApi';
import { ScannerResultCard } from '../../features/scanner/components/ScannerResultCard';
import {
  Upload,
  Sparkles,
  AlertCircle,
  ImageIcon,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const FoodScannerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const executeScan = async (imageToScan?: File | Blob) => {
    const file = imageToScan || selectedFile;
    if (!file) {
      setErrorMsg('Please select an image file first.');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);

    try {
      const data = await scannerApi.scanFoodImage(file);
      setScanResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'AI recognition failed. Please ensure the image clearly shows food and try again.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-10">
      {/* Banner Title */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Nutrition Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-slate-900 tracking-tight">
          AI Food Scanner & Nutrition Engine
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Food Recognition • Nutrition Database Lookup • User Profile & Allergy Matching • Suitability Scoring • Healthier Alternatives • Portion Advice • AI Recommendations
        </p>
      </div>

      {/* Main Container */}
      {!scanResult && !isScanning && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-8 max-w-5xl mx-auto">
          {errorMsg && (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm sm:text-base font-semibold flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dropzone File Picker */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative p-10 sm:p-14 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-xs"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 group-hover:bg-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-all mb-4 shadow-sm">
              <Upload className="w-10 h-10 text-emerald-600" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-800 font-outfit">
              Choose Photo from File
            </span>
            <span className="text-sm text-slate-500 font-medium mt-1.5 max-w-md">
              Drag & drop your food meal photo here, or click to browse files (JPG, PNG, WEBP)
            </span>
            <div className="mt-5 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs group-hover:border-emerald-300 group-hover:text-emerald-700 transition-colors">
              Browse Files
            </div>
          </div>

          {/* Image Preview & Scan Action */}
          {previewUrl && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center space-x-4">
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-300 shadow-sm"
                />
                <div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Image Ready for Analysis</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Click Analyze to proceed</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => executeScan()}
                  className="flex-1 sm:flex-initial px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4.5 h-4.5 fill-white" />
                  <span>Analyze Meal Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scanning Loading State */}
      {isScanning && (
        <div className="bg-white rounded-3xl p-14 shadow-xl border border-slate-200 text-center space-y-6 animate-pulse max-w-4xl mx-auto">
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
              <Sparkles className="w-12 h-12 animate-spin" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              Analyzing Image with Gemini Vision AI...
            </h3>
            <p className="text-sm text-slate-600 font-medium mt-1.5">
              Identifying ingredients, assessing healthy status, and calculating macronutrients
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {scanResult && <ScannerResultCard result={scanResult} onReset={handleReset} />}
    </div>
  );
};

export default FoodScannerPage;
