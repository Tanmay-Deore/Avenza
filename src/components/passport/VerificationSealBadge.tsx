import React from 'react';
import { BadgeCheck, ShieldCheck } from 'lucide-react';

interface VerificationSealBadgeProps {
  level: number;
  evidenceCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerificationSealBadge: React.FC<VerificationSealBadgeProps> = ({
  level,
  evidenceCount = 1,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#9BB59F]/40 bg-gradient-to-r from-[rgba(155,181,159,0.18)] to-[rgba(155,181,159,0.08)] shadow-sm hover:border-[#9BB59F] transition-all duration-300 ${
        isSm ? 'text-[11px] py-1 px-2.5' : isLg ? 'text-sm py-2 px-4' : 'text-xs'
      } ${className}`}
      title={`Level ${level} formally verified with ${evidenceCount} executable proof artifact(s)`}
    >
      {/* Subtle outer pulse aura */}
      <span className="absolute -inset-[1px] rounded-xl bg-[#9BB59F]/20 opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-300 pointer-events-none" />

      {/* Verification Seal Ring */}
      <div className="relative flex items-center justify-center">
        <svg
          className={`text-[#9BB59F] transition-transform duration-300 group-hover:rotate-12 ${
            isSm ? 'w-4 h-4' : isLg ? 'w-5 h-5' : 'w-4 h-4'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" strokeDasharray="4 2" className="opacity-75" />
          <path d="m9 12 2 2 4-4" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="flex items-center gap-1.5 font-mono font-bold text-[#B4CCB8] tracking-tight">
        <span>VERIFIED</span>
        <span className="text-[#F5EFE4] bg-[#30312C] px-1.5 py-0.5 rounded text-[10px] border border-[#4A4A42]">
          L{level}
        </span>
      </div>

      {evidenceCount > 0 && (
        <span className="text-[10px] text-[#A39F94] font-mono border-l border-[#4A4A42] pl-1.5 hidden sm:inline">
          {evidenceCount} {evidenceCount === 1 ? 'artifact' : 'artifacts'}
        </span>
      )}
    </div>
  );
};
