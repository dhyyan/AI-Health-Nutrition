import React, { useState } from 'react';
import { scannerApi, ScanResultData } from '../../services/scannerApi';
import { ScannerResultCard } from '../../features/scanner/components/ScannerResultCard';
import { CameraCaptureModal } from '../../features/scanner/components/CameraCaptureModal';
import {
  Upload,
  AlertCircle,
  Camera,
  CheckCircle2,
  Zap,
  Loader2,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

export const FoodScannerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleFileSelect = (file: File) => {
    // Reset previous scan results and errors when a new image is chosen
    setScanResult(null);
    setErrorMsg(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCameraCapture = (blob: Blob) => {
    setScanResult(null);
    setErrorMsg(null);
    setSelectedFile(blob);
    const url = URL.createObjectURL(blob);
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
    setScanResult(null);

    try {
      const data = await scannerApi.scanFoodImage(file);
      setScanResult(data);
    } catch (err: any) {
      console.error('Scan error:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        'AI recognition failed. Please ensure the image clearly shows food and try again.';
      setErrorMsg(serverMessage);
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
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black uppercase tracking-wider">
          <span>AI Vision Nutrition Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit text-slate-900 tracking-tight">
          AI Food Scanner & Nutrition Engine
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Upload or capture a meal photograph for visual ingredient recognition, portion estimation, nutritional breakdown, and allergy screening powered by Google Gemini Vision.
        </p>
      </div>

      {/* Main Upload / Drag Container (Shown when no result and not scanning) */}
      {!scanResult && !isScanning && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-8 max-w-5xl mx-auto">
          {errorMsg && (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm sm:text-base font-semibold flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Row: Dropzone File Picker & Live Camera */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="md:col-span-2 relative p-8 sm:p-12 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-xs"
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100 group-hover:bg-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-all mb-4 shadow-sm">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-800 font-outfit">
                Choose Meal Photo
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-md">
                Drag & drop your food photo here, or click to browse files (JPEG, PNG, WEBP up to 10MB)
              </span>
              <div className="mt-4 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs group-hover:border-emerald-300 group-hover:text-emerald-700 transition-colors">
                Browse Files
              </div>
            </div>

            {/* Camera Capture Card */}
            <div
              onClick={() => setIsCameraOpen(true)}
              className="p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-xs"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-200 group-hover:bg-emerald-100 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 group-hover:scale-105 transition-all mb-4 shadow-sm">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-800 font-outfit">
                Live Camera
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1 max-w-xs">
                Snap a real-time photo of your plate or meal with your device camera
              </span>
              <div className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs group-hover:border-emerald-300 group-hover:text-emerald-700 transition-colors">
                Open Camera
              </div>
            </div>
          </div>

          {/* Image Preview & Scan Action */}
          {previewUrl && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5 animate-in fade-in duration-200">
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

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Scanning Loading State */}
      {isScanning && (
        <div className="bg-white rounded-3xl p-14 shadow-xl border border-slate-200 text-center space-y-6 animate-pulse max-w-4xl mx-auto">
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              Analyzing Image with Gemini Vision AI...
            </h3>
            <p className="text-sm text-slate-600 font-medium mt-1.5">
              Identifying ingredients, checking food categories, and estimating nutritional metrics
            </p>
          </div>
        </div>
      )}

      {/* Non-Food / Unclear Rejection State */}
      {scanResult && !scanResult.isFood && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-200/80 space-y-6 max-w-3xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-700 mx-auto shadow-sm">
            {scanResult.isUnclear ? (
              <HelpCircle className="w-10 h-10 text-amber-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-amber-600" />
            )}
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
              <span>{scanResult.isUnclear ? 'Unclear Image' : 'No Food Detected'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              {scanResult.isUnclear ? 'Photograph Too Unclear' : 'No Identifiable Food Detected'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              {scanResult.message ||
                'No food detected. Please upload a clear photograph of your meal.'}
            </p>
          </div>

          {previewUrl && (
            <div className="max-w-xs mx-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={previewUrl}
                alt="Uploaded photo"
                className="w-full h-44 object-cover rounded-xl"
              />
              <span className="text-[11px] text-slate-400 font-semibold block mt-2">
                Analyzed Image
              </span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={handleReset}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Upload a Meal Photograph</span>
            </button>
          </div>
        </div>
      )}

      {/* Successful Food Analysis Result Display */}
      {scanResult && scanResult.isFood && (
        <ScannerResultCard result={scanResult} onReset={handleReset} />
      )}
    </div>
  );
};

export default FoodScannerPage;
