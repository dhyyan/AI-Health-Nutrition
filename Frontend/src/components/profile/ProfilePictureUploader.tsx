import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader2, User as UserIcon, AlertCircle } from 'lucide-react';

interface ProfilePictureUploaderProps {
  currentPictureUrl?: string | null;
  userName: string;
  onUpload: (file: File) => Promise<void>;
}

export const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  currentPictureUrl,
  userName,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `http://localhost:5000${url}`;
  };

  const handleFileChange = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit.');
      return;
    }

    setErrorMsg(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload profile picture.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = previewUrl || formatImageUrl(currentPictureUrl);
  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col items-center sm:items-start space-y-3">
      <div className="relative group">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-lg flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 ${
            isDragOver
              ? 'border-emerald-500 scale-105 shadow-emerald-200/50'
              : 'border-white group-hover:border-emerald-300'
          }`}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={userName}
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white font-outfit text-4xl font-extrabold shadow-inner">
              {initial}
            </div>
          )}

          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-[10px] font-semibold tracking-wider uppercase">Uploading</span>
            </div>
          )}

          {/* Hover overlay button */}
          {!isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white"
              title="Change Profile Picture"
            >
              <Camera className="w-6 h-6 mb-1 text-white" />
              <span className="text-[11px] font-bold">Update</span>
            </button>
          )}
        </div>

        {/* Floating Upload Badge button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-white"
          title="Upload image"
        >
          <Upload className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="text-center sm:text-left">
        <p className="text-xs font-medium text-slate-500">
          Allowed JPG, PNG or WEBP (Max 5MB).
        </p>
        {errorMsg && (
          <p className="text-xs font-semibold text-rose-600 flex items-center justify-center sm:justify-start space-x-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </p>
        )}
      </div>
    </div>
  );
};
