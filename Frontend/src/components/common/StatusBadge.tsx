import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'blocked' | 'verified' | 'unverified' | 'admin' | 'user' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let dotColor = 'bg-slate-400';
  let label = status;

  switch (normalized) {
    case 'active':
      styles = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 shadow-sm shadow-emerald-950';
      dotColor = 'bg-emerald-400';
      label = 'Active';
      break;
    case 'blocked':
      styles = 'bg-rose-950/80 text-rose-300 border-rose-800/80 shadow-sm shadow-rose-950';
      dotColor = 'bg-rose-400';
      label = 'Blocked';
      break;
    case 'verified':
    case 'true':
      styles = 'bg-blue-950/80 text-blue-300 border-blue-800/80 shadow-sm shadow-blue-950';
      dotColor = 'bg-blue-400';
      label = 'Verified';
      break;
    case 'unverified':
    case 'false':
      styles = 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow-sm shadow-amber-950';
      dotColor = 'bg-amber-400';
      label = 'Unverified';
      break;
    case 'admin':
      styles = 'bg-purple-950/80 text-purple-300 border-purple-800/80 shadow-sm shadow-purple-950';
      dotColor = 'bg-purple-400';
      label = 'Admin';
      break;
    case 'user':
      styles = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
      dotColor = 'bg-slate-400';
      label = 'User';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-sm ${styles} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};
