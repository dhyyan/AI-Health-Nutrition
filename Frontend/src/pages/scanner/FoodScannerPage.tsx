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

          {/* Action Tabs: Upload vs Live Camera */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Live Camera Button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="p-8 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all flex flex-col items-center justify-center space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <span className="text-lg font-extrabold font-outfit block">Real-Time Camera</span>
                <span className="text-xs sm:text-sm text-emerald-100 font-medium">Capture photo via webcam / camera</span>
              </div>
            </button>

            {/* Dropzone File Picker */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-16 h-16 rounded-2xl bg-slate-200 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 transition-colors mb-3">
                <Upload className="w-8 h-8" />
              </div>
              <span className="text-base font-extrabold text-slate-800 font-outfit">Choose Image File</span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Drag & drop or browse JPG, PNG, WEBP
              </span>
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
