import React, { useState } from 'react';
import { scannerApi, ScanResultData } from '../../services/scannerApi';
import { CameraCaptureModal } from '../../features/scanner/components/CameraCaptureModal';
import { ScannerResultCard } from '../../features/scanner/components/ScannerResultCard';
import {
  Camera,
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
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

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

  const handleCameraCapture = (blob: Blob) => {
    setErrorMsg(null);
    setSelectedFile(blob);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    // Auto-trigger analysis for seamless camera capture experience
    executeScan(blob);
  };

  const executeScan = async (imageToScan?: File | Blob) => {
    const file = imageToScan || selectedFile;
    if (!file) {
      setErrorMsg('Please select an image file or capture a photo first.');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Banner Title */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Nutrition Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-outfit text-slate-900 tracking-tight">
          AI Food Scanner & Nutrition Engine
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto font-medium">
          Food Recognition • Nutrition Database Lookup • User Profile & Allergy Matching • Suitability Scoring • Healthier Alternatives • Portion Advice • AI Recommendations
        </p>
      </div>

      {/* Main Container */}
      {!scanResult && !isScanning && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs sm:text-sm font-semibold flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Tabs: Upload vs Live Camera */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live Camera Button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="p-6 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all flex flex-col items-center justify-center space-y-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <span className="text-base font-extrabold font-outfit block">Real-Time Camera</span>
                <span className="text-xs text-emerald-100 font-medium">Capture photo via webcam / camera</span>
              </div>
            </button>

            {/* Dropzone File Picker */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative p-6 rounded-3xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-14 h-14 rounded-2xl bg-slate-200 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition-colors mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-slate-800 font-outfit">Choose Image File</span>
              <span className="text-xs text-slate-400 font-medium mt-1">
                Drag & drop or browse JPG, PNG, WEBP
              </span>
            </div>
          </div>

          {/* Image Preview & Scan Action */}
          {previewUrl && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-sm"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Image Ready for Analysis</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Click Analyze to proceed</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => executeScan()}
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Analyze Meal Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scanning Loading State */}
      {isScanning && (
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200 text-center space-y-6 animate-pulse">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
              <Sparkles className="w-10 h-10 animate-spin" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black font-outfit text-slate-900">
              Analyzing Image with Gemini Vision AI...
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Identifying ingredients, assessing healthy status, and calculating macronutrients
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {scanResult && <ScannerResultCard result={scanResult} onReset={handleReset} />}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default FoodScannerPage;
