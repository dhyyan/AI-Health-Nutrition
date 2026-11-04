import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Loader2, Upload } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageBlob: Blob) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    isMobile ? 'environment' : 'user'
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);

  // Stable stopCamera without stream dependency re-renders
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping camera track:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setCapturedDataUrl(null);
    setIsLoading(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by this browser.');
      }

      let mediaStream: MediaStream;

      // Primary attempt with ideal constraints
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (primaryErr) {
        console.warn('Initial facingMode camera constraint failed, attempting fallback to basic video:', primaryErr);
        // Fallback for single-webcam laptops & desktops
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((playErr) => {
            console.warn('Video auto-play warning:', playErr);
          });
        };
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('Error starting camera stream:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please allow camera access in your browser address bar.'
          : 'Unable to access device camera. Please check your webcam permissions or upload a photograph directly.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedDataUrl(dataUrl);
    }
  };

  const handleConfirmCapture = () => {
    if (!capturedDataUrl) return;

    fetch(capturedDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        onCapture(blob);
        stopCamera();
        onClose();
      })
      .catch((err) => {
        console.error('Failed to convert captured photo to blob:', err);
      });
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onCapture(file);
      stopCamera();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg font-outfit">Real-Time Camera Scanner</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Stream Viewport */}
        <div className="relative flex-1 bg-black min-h-[320px] flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 z-20 space-y-3 text-white">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Initializing camera...</span>
            </div>
          )}

          {cameraError ? (
            <div className="p-6 text-center text-rose-300 space-y-4 max-w-xs z-10">
              <AlertCircle className="w-10 h-10 mx-auto text-rose-400" />
              <p className="text-xs font-semibold leading-relaxed">{cameraError}</p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Camera</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo from Device</span>
                </button>
              </div>
            </div>
          ) : capturedDataUrl ? (
            <img
              src={capturedDataUrl}
              alt="Captured frame"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                onCanPlay={() => {
                  videoRef.current?.play().catch(() => {});
                }}
              />
              {/* Scan Overlay Guidelines */}
              <div className="absolute inset-0 border-2 border-dashed border-emerald-400/40 m-8 rounded-3xl pointer-events-none flex items-center justify-center">
                <div className="bg-slate-900/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[11px] font-bold text-emerald-300 flex items-center justify-center">
                  <span>Center Food Item in View</span>
                </div>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Controls Bar */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {!capturedDataUrl ? (
            <>
              <button
                onClick={toggleCameraFacing}
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                title={`Switch camera (current: ${facingMode})`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleSnap}
                disabled={!!cameraError || isLoading}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Capture Photo"
              >
                <Camera className="w-7 h-7" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                title="Browse file from device"
              >
                <Upload className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3 w-full">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>

              <button
                onClick={handleConfirmCapture}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Analyze Meal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
