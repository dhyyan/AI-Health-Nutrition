import React from 'react';
import { Info } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
  disclaimer?: string;
}

export const MedicalDisclaimerBanner: React.FC<MedicalDisclaimerBannerProps> = ({
  disclaimer = 'This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.',
}) => {
  return (
    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 text-sm sm:text-base flex items-start space-x-4 shadow-xs">
      <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
      <p className="leading-relaxed font-medium">
        <strong className="font-extrabold text-amber-900">Medical Safety Disclaimer:</strong>{' '}
        {disclaimer}
      </p>
    </div>
  );
};
